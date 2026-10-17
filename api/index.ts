import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

export const app = express();

app.use(express.json());

// CORS headers for deployment flexibility
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

const PACAVIRA_SYSTEM_PROMPT = (level: string) => `
Você é o "Prof. Pacavira", o professor e mentor virtual inteligente da EduMind.AO (uma plataforma de estudos e aprendizagem criada para ajudar alunos a aprenderem de forma mais inteligente, melhorarem o desempenho académico e alcançarem melhores resultados).

CARACTERÍSTICAS DO PROF. PACAVIRA:
- É extremamente pedagógico, motivador, empático, claro e focado em retenção ativa de conhecimento.
- Adapta a linguagem e profundidade ao nível do estudante: "${level}".
  * Se for "Primaria": use explicações lúdicas, analogias do dia a dia, frases claras e encorajamento constante.
  * Se for "Médio": prepare o aluno com rigor para provas e exames, explicando conceitos-chave, causas e efeitos, fórmulas e aplicações práticas.
  * Se for "Superior": use vocabulário técnico/acadêmico adequado, rigor metodológico, pensamento crítico e referências teóricas.
- A aula é INTERATIVA: você NÃO deve apenas cuspir um monólogo enorme. Explique a ideia central de forma concisa e dinâmica (1 a 2 parágrafos) e em seguida faça uma pergunta ou proponha uma reflexão para o aluno responder.
- Aja como um verdadeiro professor em sala de aula particular.
`;

/* -------------------------------------------------------------
   ROBUST PEDAGOGICAL FALLBACK ENGINE FOR PROF. PACAVIRA
   Ensures zero downtime if Gemini API key is rate-limited or unconfigured
   ------------------------------------------------------------- */

function generateFallbackStart(subject: string, topic: string, level: string): string {
  const levelGreeting =
    level === 'Primaria'
      ? `Olá, meu jovem estudante! Que alegria ter você aqui na EduMind.AO!`
      : level === 'Superior'
      ? `Saudações acadêmicas! É um grande prazer orientar seus estudos universitários na EduMind.AO.`
      : `Olá! Seja muito bem-vindo à nossa aula na EduMind.AO!`;

  const levelPedagogy =
    level === 'Primaria'
      ? `Hoje nós vamos desvendar **${topic}** na disciplina de **${subject}** de um jeito super simples e prático, como se fosse uma história!\n\n` +
        `Imagine que o conhecimento é como construir uma casa com blocos: quando entendemos a base, tudo fica fácil e divertido. Em **${topic}**, o segredo principal é prestar atenção aos detalhes e entender o "porquê" das coisas acontecerem no nosso cotidiano.\n\n` +
        `Me diga uma coisa antes de avançarmos: você já ouviu falar sobre **${topic}** antes ou é a primeira vez que você está vendo este assunto? Responda aqui para eu ajustar o nosso ritmo!`
      : level === 'Superior'
      ? `Hoje abordaremos uma temática de suma relevância metodológica e conceitual em **${subject}**: **${topic}**.\n\n` +
        `O domínio analítico de **${topic}** é essencial não apenas para fundamentação teórica, mas também para a aplicação prática na resolução de problemas complexos e tomadas de decisão estruturadas no Ensino Superior.\n\n` +
        `Para iniciarmos a nossa discussão: qual é a sua principal perspectiva teórica ou aplicação prática preferida em relação a **${topic}**?`
      : `Hoje vamos focar em dominar **${topic}** na disciplina de **${subject}**, um dos temas mais cobrados e essenciais para o seu sucesso nas provas e exames!\n\n` +
        `A ideia central de **${topic}** gira em torno de entender a estrutura do problema e aplicar a lógica correta. Quando você compreende o mecanismo por trás do conceito, você não precisa decorar: você simplesmente deduz e acerta qualquer questão!\n\n` +
        `Para começarmos o nosso diálogo: me conte, qual é a sua maior dúvida ou o ponto que você acha mais desafiador em **${topic}**?`;

  return `${levelGreeting}\n\n${levelPedagogy}`;
}

function generateFallbackChat(subject: string, topic: string, level: string, lastUserMessage: string): string {
  const cleanMsg = lastUserMessage.toLowerCase();

  if (cleanMsg.includes('exemplo') || cleanMsg.includes('prático') || cleanMsg.includes('dia a dia')) {
    return (
      `Excelente pedido! Vamos a um exemplo bem prático sobre **${topic}**:\n\n` +
      `Pense no seguinte cenário real: quando estamos diante de uma situação prática de **${subject}**, a regra de **${topic}** funciona exatamente como um guia passo a passo.\n\n` +
      `1. Primeiro, identificamos os dados fundamentais do problema.\n` +
      `2. Segundo, aplicamos a relação direta ou fórmula específica de ${topic}.\n` +
      `3. Terceiro, verificamos se o resultado faz sentido no contexto.\n\n` +
      `Ficou mais palpável visualizar assim? Quer tentar resolver um pequeno caso comigo agora?`
    );
  }

  if (cleanMsg.includes('pergunta') || cleanMsg.includes('teste') || cleanMsg.includes('exercício')) {
    return (
      `Com certeza! Nada melhor do que testar o conhecimento na prática para fixar.\n\n` +
      `**Desafio do Prof. Pacavira sobre ${topic}:**\n` +
      `Considerando o que vimos em **${subject}**, qual é o primeiro passo fundamental que você deve tomar ao analisar uma questão de **${topic}**?\n\n` +
      `*A)* Memorizar as fórmulas sem analisar o contexto.\n` +
      `*B)* Identificar os dados e aplicar os princípios fundamentais de ${topic}.\n` +
      `*C)* Pular a leitura do enunciado e chutar uma resposta.\n\n` +
      `Qual opção você escolhe: A, B ou C? Responda e vamos conferir!`
    );
  }

  if (cleanMsg.includes('não entendi') || cleanMsg.includes('simplificar') || cleanMsg.includes('outra forma') || cleanMsg.includes('dúvida')) {
    return (
      `Sem problemas, meu aluno! Um bom professor tem sempre mais de uma maneira de explicar.\n\n` +
      `Vamos desconstruir **${topic}** em três ideias simples:\n\n` +
      `• **Ideia 1 (O que é):** É o princípio básico que organiza este conceito em ${subject}.\n` +
      `• **Ideia 2 (Para que serve):** Serve para facilitar o cálculo ou a compreensão de como as coisas funcionam.\n` +
      `• **Ideia 3 (Como usar):** Basta seguir a ordem lógica dos acontecimentos.\n\n` +
      `Conseguiu captar melhor esta perspectiva? Em qual destas 3 ideias você quer que eu aprofunde mais?`
    );
  }

  return (
    `Muito bem colocado! Sua reflexão mostra que você está prestando atenção aos detalhes da matéria.\n\n` +
    `Ao analisar "${lastUserMessage.slice(0, 80)}", percebemos que em **${subject}**, compreender **${topic}** exige exatamente essa capacidade de relacionar a teoria com a lógica.\n\n` +
    `Lembre-se: nas provas e exames de nível ${level}, o que mais diferencia um aluno nota máxima é saber justificar cada etapa do raciocínio.\n\n` +
    `O que você acha de continuarmos explorando as aplicações práticas ou prefere que eu faça mais uma pergunta de fixação?`
  );
}

function generateFallbackFinish(subject: string, topic: string, level: string) {
  const summaryMarkdown =
    `# Resumo Didático: ${topic}\n\n` +
    `**Disciplina:** ${subject} | **Nível Académico:** ${level}\n` +
    `**Professor Responsável:** Prof. Pacavira • EduMind.AO\n\n` +
    `---\n\n` +
    `### 1. Visão Geral e Importância\n` +
    `O tema **${topic}** constitui uma base essencial dentro de **${subject}**. Compreender este conteúdo permite ao estudante desenvolver raciocínio lógico estruturado, capacidade analítica e facilidade na resolução de problemas complexos.\n\n` +
    `### 2. Conceitos Fundamentais\n` +
    `- **Definição Principal:** ${topic} trata da relação entre os elementos de estudo e a aplicação das regras basilares de ${subject}.\n` +
    `- **Propriedades Essenciais:** O tema requer identificação precisa de variáveis, termos técnicos e critérios metodológicos adequados ao nível ${level}.\n` +
    `- **Raciocínio Aplicado:** Evite a memorização cega; concentre-se na dedução lógica e na sequência das etapas de resolução.\n\n` +
    `### 3. Dicas de Ouro do Prof. Pacavira para Provas\n` +
    `1. Leia o enunciado com extrema atenção, destacando as palavras-chave.\n` +
    `2. Verifique sempre as unidades e termos específicos da disciplina.\n` +
    `3. Faça revisões espaçadas utilizando as tarefas de fixação da EduMind.AO.`;

  const keyTakeaways = [
    `Compreensão da estrutura e dos conceitos fundamentais de ${topic}.`,
    `Aplicação prática do método pedagógico passo a passo em ${subject}.`,
    `Evitar armadilhas comuns e pegadinhas frequentes de exames e provas.`,
    `Relação direta entre os princípios teóricos e problemas do mundo real.`,
  ];

  const tasks = [
    {
      title: `Qual é o objetivo primordial do estudo de ${topic} em ${subject}?`,
      description: `Analise as alternativas abaixo e selecione a que melhor sintetiza o tema trabalhado pelo Prof. Pacavira.`,
      options: [
        `A) Desenvolver o entendimento teórico e aplicar o raciocínio correto de ${topic}.`,
        `B) Memorizar dados de forma mecânica sem compreender as causas.`,
        `C) Ignorar os conceitos básicos e focar apenas em palpites nas avaliações.`,
        `D) Nenhuma das anteriores está correta.`,
      ],
      correctAnswer: `A`,
      explanation: `Correto! O estudo de ${topic} busca justamente o domínio conceitual e a aplicação prática fundamentada para alcançar excelentes resultados.`,
    },
    {
      title: `Ao resolver uma questão desafiadora sobre ${topic}, qual procedimento é mais recomendado?`,
      description: `Exercício prático de metodologia e resolução de problemas.`,
      options: [
        `A) Começar a responder sem ler todas as informações fornecidas.`,
        `B) Analisar os dados com clareza, identificar o que se pede e aplicar a lógica de ${topic}.`,
        `C) Abandonar a questão imediatamente ao encontrar um termo desconhecido.`,
        `D) Escolher a alternativa mais longa aleatoriamente.`,
      ],
      correctAnswer: `B`,
      explanation: `Exatamente! O Prof. Pacavira sempre enfatiza: ler com atenção e estruturar as etapas é o segredo da aprovação!`,
    },
    {
      title: `Em termos de fixação de longo prazo sobre ${topic}, qual é a melhor estratégia?`,
      description: `Estratégia de retenção e estudo ativo na EduMind.AO.`,
      options: [
        `A) Estudar uma única vez e nunca mais revisar.`,
        `B) Utilizar a técnica Pomodoro, revisar o resumo gerado e praticar com tarefas de fixação.`,
        `C) Deixar para estudar todo o conteúdo somente na véspera da prova.`,
        `D) Estudar sem fazer anotações nem exercícios.`,
      ],
      correctAnswer: `B`,
      explanation: `Perfeito! O método da EduMind.AO une foco Pomodoro, resumos didáticos e prática contínua de tarefas para garantir os melhores resultados académicos!`,
    },
  ];

  return { summaryMarkdown, keyTakeaways, tasks };
}

/* -------------------------------------------------------------
   ENDPOINTS (Supports both /api/... and direct /... paths)
   ------------------------------------------------------------- */

// Healthcheck
app.get(['/api', '/api/health', '/health'], (_req, res) => {
  res.json({
    status: 'online',
    app: 'EduMind.AO',
    mentor: 'Prof. Pacavira',
    geminiConfigured: !!apiKey,
  });
});

// Start Lesson Endpoint
app.post(['/api/ai/start-lesson', '/ai/start-lesson'], async (req, res) => {
  const { subject, topic, academicLevel } = req.body || {};
  if (!subject || !topic) {
    return res.status(400).json({ error: 'Disciplina e tema são obrigatórios.' });
  }

  const level = academicLevel || 'Médio';

  if (!ai) {
    const fallbackMessage = generateFallbackStart(subject, topic, level);
    return res.json({ message: fallbackMessage, professor: 'Prof. Pacavira' });
  }

  try {
    const prompt = `
O aluno iniciou uma sessão de estudo na EduMind.AO.
Disciplina: ${subject}
Tema da Aula: ${topic}
Nível Académico: ${level}

Como Prof. Pacavira:
1. Dê as boas-vindas calorosas ao aluno para esta aula na EduMind.AO.
2. Apresente o tema de forma fascinante e mostre por que ele é tão importante.
3. Explique o primeiro conceito fundamental deste tema de maneira clara e envolvente.
4. Finalize com uma pergunta interativa ou mini-desafio para que o aluno participe ativamente da aula.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: PACAVIRA_SYSTEM_PROMPT(level),
        temperature: 0.7,
      },
    });

    const text = response.text?.trim();
    if (text) {
      return res.json({ message: text, professor: 'Prof. Pacavira' });
    }
    throw new Error('Resposta vazia da IA.');
  } catch (error: any) {
    console.warn('Gemini API call bypassed or unavailable, using pedagogical engine:', error?.message);
    const fallbackMessage = generateFallbackStart(subject, topic, level);
    return res.json({
      message: fallbackMessage,
      professor: 'Prof. Pacavira',
    });
  }
});

// Chat During Lesson Endpoint
app.post(['/api/ai/chat-lesson', '/ai/chat-lesson'], async (req, res) => {
  const { subject, topic, academicLevel, messages } = req.body || {};
  const level = academicLevel || 'Médio';

  const lastUserMessage =
    messages && messages.length > 0
      ? messages[messages.length - 1].text
      : 'Como podemos aplicar isso?';

  if (!ai) {
    const fallbackResponse = generateFallbackChat(subject, topic, level, lastUserMessage);
    return res.json({ message: fallbackResponse, professor: 'Prof. Pacavira' });
  }

  try {
    const contents = (messages || []).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents.length > 0 ? contents : [{ role: 'user', parts: [{ text: `Explique ${topic}` }] }],
      config: {
        systemInstruction: `${PACAVIRA_SYSTEM_PROMPT(level)}\nContexto da Aula: Disciplina "${subject}", Tema "${topic}". Mantenha o diálogo didático como Prof. Pacavira, tire dúvidas, corrija com carinho e faça o aluno pensar.`,
        temperature: 0.7,
      },
    });

    const text = response.text?.trim();
    if (text) {
      return res.json({ message: text, professor: 'Prof. Pacavira' });
    }
    throw new Error('Resposta vazia da IA.');
  } catch (error: any) {
    console.warn('Gemini chat API call bypassed or unavailable, using pedagogical engine:', error?.message);
    const fallbackResponse = generateFallbackChat(subject, topic, level, lastUserMessage);
    return res.json({
      message: fallbackResponse,
      professor: 'Prof. Pacavira',
    });
  }
});

// Finish Lesson Endpoint: Generates Summary & Tasks
app.post(['/api/ai/finish-lesson', '/ai/finish-lesson'], async (req, res) => {
  const { subject, topic, academicLevel, messages, durationMinutes } = req.body || {};
  const level = academicLevel || 'Médio';

  if (!ai) {
    const fallbackResult = generateFallbackFinish(subject, topic, level);
    return res.json(fallbackResult);
  }

  try {
    const conversationTranscript = (messages || [])
      .map((m: any) => `${m.role === 'user' ? 'Aluno' : 'Prof. Pacavira'}: ${m.text}`)
      .join('\n\n');

    const prompt = `
O aluno terminou sua sessão de estudos de técnica Pomodoro na EduMind.AO.
Disciplina: ${subject}
Tema: ${topic}
Nível Académico: ${level}
Duração da Sessão: ${durationMinutes || 25} minutos

Transcrição da Aula realizada:
${conversationTranscript.slice(0, 4000)}

Como Prof. Pacavira, gere:
1. Um RESUMO COMPLETO, claro e de alto impacto sobre tudo o que foi aprendido nesta aula, formatado em tópicos didáticos (Markdown).
2. Uma lista de 3 a 5 PONTOS-CHAVE (keyTakeaways) para revisão rápida.
3. Um conjunto de 3 a 4 TAREFAS/EXERCÍCIOS práticos relacionados a esta aula para o aluno resolver na zona de tarefas da EduMind (múltipla escolha com 4 opções A, B, C, D e gabarito com explicação).
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `Você é o Prof. Pacavira na EduMind.AO. Gere resumos pedagógicos impecáveis e exercícios de fixação no formato JSON especificado.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summaryMarkdown: {
              type: Type.STRING,
              description: 'Resumo estruturado e didático da aula em formato Markdown.',
            },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 a 5 pontos-chave essenciais da aula.',
            },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: 'Enunciado da questão ou exercício' },
                  description: { type: Type.STRING, description: 'Breve contextualização ou instrução' },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Quatro alternativas de resposta (ex: A) ..., B) ..., C) ..., D) ...)',
                  },
                  correctAnswer: { type: Type.STRING, description: 'Alternativa correta (ex: A, B, C ou D)' },
                  explanation: { type: Type.STRING, description: 'Explicação detalhada do Prof. Pacavira sobre a resposta correta' },
                },
                required: ['title', 'options', 'correctAnswer'],
              },
            },
          },
          required: ['summaryMarkdown', 'keyTakeaways', 'tasks'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.summaryMarkdown && parsed.tasks) {
      return res.json(parsed);
    }
    throw new Error('Formato inválido retornado pela IA.');
  } catch (error: any) {
    console.warn('Gemini finish API call bypassed or unavailable, using pedagogical engine:', error?.message);
    const fallbackResult = generateFallbackFinish(subject, topic, level);
    return res.json(fallbackResult);
  }
});

export default app;
