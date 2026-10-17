import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';
import { Disciplina, saveResumo, saveTarefasBatch, startLessonAI, chatLessonAI, finishLessonAI } from '../services/studyService.ts';
import {
  GraduationCap,
  Play,
  Pause,
  RotateCcw,
  Send,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  ArrowRight,
  Brain,
  MessageSquare,
  CheckSquare,
  HelpCircle,
  X,
} from 'lucide-react';

interface ZonaEstudoProps {
  userId: string;
  userLevel: string;
  disciplinas: Disciplina[];
  initialDisciplina?: string;
  initialTema?: string;
  onNavigateToResumos: () => void;
  onNavigateToTarefas: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const ZonaEstudo: React.FC<ZonaEstudoProps> = ({
  userId,
  userLevel,
  disciplinas,
  initialDisciplina = '',
  initialTema = '',
  onNavigateToResumos,
  onNavigateToTarefas,
}) => {
  const { isDark } = useTheme();
  // Session Configuration State
  const [selectedDisciplina, setSelectedDisciplina] = useState(initialDisciplina);
  const [customDisciplina, setCustomDisciplina] = useState('');
  const [selectedTema, setSelectedTema] = useState(initialTema);
  const [customTema, setCustomTema] = useState('');
  const [academicLevel, setAcademicLevel] = useState(userLevel || 'Médio');
  const [sessionMinutes, setSessionMinutes] = useState(25);
  const [setupError, setSetupError] = useState<string | null>(null);

  // Active Session State
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [loadingStart, setLoadingStart] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Pomodoro State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  // Finish Confirmation Modal State
  const [confirmFinishOpen, setConfirmFinishOpen] = useState(false);

  // Finishing State & Result Modal
  const [finishing, setFinishing] = useState(false);
  const [finishSuccess, setFinishSuccess] = useState<{
    summaryMarkdown: string;
    keyTakeaways: string[];
    taskCount: number;
    disciplina: string;
    tema: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-fill when initial props change
  useEffect(() => {
    if (initialDisciplina) setSelectedDisciplina(initialDisciplina);
    if (initialTema) setSelectedTema(initialTema);
  }, [initialDisciplina, initialTema]);

  // Pomodoro countdown timer
  useEffect(() => {
    let interval: any = null;
    if (isSessionActive && isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, isTimerRunning, timeLeft]);

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sendingMessage]);

  const activeDisciplinaName = selectedDisciplina === '__custom' || !selectedDisciplina ? customDisciplina : selectedDisciplina;
  const activeTemaName = selectedTema === '__custom' || !selectedTema ? customTema : selectedTema;

  // Selected discipline object
  const currentDiscObj = disciplinas.find((d) => d.name === selectedDisciplina);

  // Start Class with Prof. Pacavira
  const handleStartLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError(null);

    if (!activeDisciplinaName.trim() || !activeTemaName.trim()) {
      setSetupError('Por favor, informe a Disciplina e o Tema para iniciar a aula.');
      return;
    }

    try {
      setLoadingStart(true);
      const res = await startLessonAI({
        subject: activeDisciplinaName.trim(),
        topic: activeTemaName.trim(),
        academicLevel,
      });

      setMessages([
        {
          id: 'welcome',
          role: 'model',
          text: res.message,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      setTimeLeft(sessionMinutes * 60);
      setIsTimerRunning(true);
      setIsSessionActive(true);
    } catch (err: any) {
      setSetupError(err.message || 'Erro ao conectar com Prof. Pacavira.');
    } finally {
      setLoadingStart(false);
    }
  };

  // Send message in interactive class chat
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || userInput).trim();
    if (!text || sendingMessage) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setUserInput('');
    setSendingMessage(true);

    try {
      const response = await chatLessonAI({
        subject: activeDisciplinaName,
        topic: activeTemaName,
        academicLevel,
        messages: newMessages.map((m) => ({ role: m.role, text: m.text })),
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `m_${Date.now()}`,
          role: 'model',
          text: response.message,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'model',
          text: 'Compreendido! Vamos aprofundar este ponto da nossa aula com um exemplo direto.',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setSendingMessage(false);
    }
  };

  // Finish Lesson Execution
  const executeFinishLesson = async () => {
    setConfirmFinishOpen(false);
    try {
      setFinishing(true);
      setIsTimerRunning(false);

      const totalSpentSec = sessionMinutes * 60 - timeLeft;
      const spentMin = Math.max(1, Math.round(totalSpentSec / 60));
      setElapsedMinutes(spentMin);

      // Call AI to generate summary & tasks
      const aiResult = await finishLessonAI({
        subject: activeDisciplinaName,
        topic: activeTemaName,
        academicLevel,
        durationMinutes: spentMin,
        messages: messages.map((m) => ({ role: m.role, text: m.text })),
      });

      // Save summary in Firestore
      await saveResumo({
        userId,
        disciplina: activeDisciplinaName,
        tema: activeTemaName,
        academicLevel,
        content: aiResult.summaryMarkdown,
        keyTakeaways: aiResult.keyTakeaways || [],
        sessionDurationMinutes: spentMin,
      });

      // Save tasks in Firestore
      if (aiResult.tasks && aiResult.tasks.length > 0) {
        await saveTarefasBatch(
          userId,
          activeDisciplinaName,
          activeTemaName,
          academicLevel,
          aiResult.tasks
        );
      }

      setFinishSuccess({
        summaryMarkdown: aiResult.summaryMarkdown,
        keyTakeaways: aiResult.keyTakeaways || [],
        taskCount: aiResult.tasks?.length || 0,
        disciplina: activeDisciplinaName,
        tema: activeTemaName,
      });
      setIsSessionActive(false);
    } catch (err: any) {
      setSetupError('Erro ao finalizar aula. Tente novamente.');
    } finally {
      setFinishing(false);
    }
  };

  // Format time MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Finish Confirmation Dialog (In-app modal instead of window.confirm) */}
      {confirmFinishOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-md border rounded-3xl p-6 shadow-2xl space-y-4 transition-colors ${
            isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`font-bold text-lg font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>Encerrar esta Aula?</h3>
                <p className="text-xs text-slate-400">Disciplina: {activeDisciplinaName} • {activeTemaName}</p>
              </div>
            </div>

            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Ao clicar em confirmar, o <strong>Prof. Pacavira</strong> irá compilar o resumo completo de tudo o que foi estudado e gerar automaticamente as tarefas práticas de fixação na aba Tarefas.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmFinishOpen(false)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                  isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Continuar na Aula
              </button>
              <button
                type="button"
                onClick={executeFinishLesson}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                Sim, Gerar Resumo e Tarefas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Finish Result Modal */}
      {finishSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className={`w-full max-w-2xl border rounded-3xl p-6 sm:p-8 shadow-2xl my-8 relative animate-in fade-in zoom-in-95 transition-colors ${
            isDark ? 'bg-slate-900 border-emerald-500/40' : 'bg-white border-emerald-200'
          }`}>
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="text-center mb-6">
              <h2 className={`text-2xl font-bold font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Parabéns! Aula Concluída com Sucesso!
              </h2>
              <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                O <strong>Prof. Pacavira</strong> gerou o resumo desta aula e elaborou suas tarefas de fixação.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className={`p-4 rounded-2xl border ${
                isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-indigo-500">{finishSuccess.disciplina}</span>
                  <span>{elapsedMinutes} min de Pomodoro</span>
                </div>
                <h3 className={`text-base font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{finishSuccess.tema}</h3>

                <div className={`space-y-1.5 pt-2 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Pontos-chave aprendidos:
                  </span>
                  {finishSuccess.keyTakeaways.map((point, idx) => (
                    <div key={idx} className={`flex items-start gap-2 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3.5 rounded-xl border text-center ${
                  isDark ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200'
                }`}>
                  <span className={`text-xl font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>1</span>
                  <span className="text-xs text-indigo-500 font-medium">Resumo Salvo na Aba "Resumos"</span>
                </div>
                <div className={`p-3.5 rounded-xl border text-center ${
                  isDark ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'
                }`}>
                  <span className={`text-xl font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{finishSuccess.taskCount}</span>
                  <span className="text-xs text-purple-600 dark:text-purple-300 font-medium">Tarefas Prontas para Fazer</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setFinishSuccess(null);
                  onNavigateToTarefas();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Fazer as Tarefas da Aula Agora</span>
              </button>
              <button
                onClick={() => {
                  setFinishSuccess(null);
                  onNavigateToResumos();
                }}
                className={`flex-1 py-3 px-4 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Ver Resumo Salvo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Finishing Lesson Loading Overlay */}
      {finishing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="text-center space-y-4 max-w-md p-6">
            <div className="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/50 animate-bounce">
              <GraduationCap className="w-9 h-9 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white font-['Outfit']">
              Prof. Pacavira está finalizando a aula...
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Sintetizando os tópicos estudados, gerando o resumo oficial e elaborando exercícios de fixação.
            </p>
            <div className="flex items-center justify-center gap-2 text-indigo-400 text-xs font-semibold">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Gravando no seu histórico de estudos...</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW A: Setup Study Session */}
      {!isSessionActive ? (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-colors ${
            isDark
              ? 'bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border-indigo-500/30'
              : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50/50 border-indigo-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-3.5 mb-3">
              <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
                <Brain className="w-7 h-7" />
              </div>
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isDark
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                }`}>
                  Técnica Pomodoro & IA
                </span>
                <h2 className={`text-2xl sm:text-3xl font-extrabold font-['Outfit'] mt-1 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Zona de Estudo com Prof. Pacavira
                </h2>
              </div>
            </div>

            <p className={`text-xs sm:text-sm leading-relaxed max-w-xl ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Escolha a disciplina e o tema que você deseja aprender hoje. O <strong>Prof. Pacavira</strong> guiará
              uma aula interativa adaptada ao seu nível escolar. No final, um resumo completo e tarefas práticas serão gerados automaticamente!
            </p>
          </div>

          {setupError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{setupError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleStartLesson} className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-5 transition-colors ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            {/* 1. Disciplina */}
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                1. Selecione a Disciplina
              </label>

              {disciplinas.length > 0 ? (
                <div className="space-y-2">
                  <select
                    value={selectedDisciplina}
                    onChange={(e) => {
                      setSelectedDisciplina(e.target.value);
                      setSelectedTema('');
                    }}
                    className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all ${
                      isDark
                        ? 'bg-slate-950 border border-slate-700 text-white focus:border-indigo-500'
                        : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-indigo-600'
                    }`}
                  >
                    <option value="">Selecione uma disciplina cadastrada...</option>
                    {disciplinas.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.temas?.length || 0} temas)
                      </option>
                    ))}
                    <option value="__custom">+ Outra disciplina (Digitar manualmente)</option>
                  </select>

                  {selectedDisciplina === '__custom' && (
                    <input
                      type="text"
                      required
                      value={customDisciplina}
                      onChange={(e) => setCustomDisciplina(e.target.value)}
                      placeholder="Digite o nome da disciplina (ex: História de Angola)"
                      className={`w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all ${
                        isDark
                          ? 'bg-slate-950 border border-indigo-500 text-white'
                          : 'bg-slate-50 border border-indigo-600 text-slate-900'
                      }`}
                    />
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  required
                  value={customDisciplina}
                  onChange={(e) => setCustomDisciplina(e.target.value)}
                  placeholder="Ex: Matemática, Física, Português, Biologia..."
                  className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all ${
                    isDark
                      ? 'bg-slate-950 border border-slate-700 text-white focus:border-indigo-500'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-indigo-600'
                  }`}
                />
              )}
            </div>

            {/* 2. Tema */}
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                2. Tema ou Assunto da Aula
              </label>

              {currentDiscObj && currentDiscObj.temas && currentDiscObj.temas.length > 0 ? (
                <div className="space-y-2">
                  <select
                    value={selectedTema}
                    onChange={(e) => setSelectedTema(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all ${
                      isDark
                        ? 'bg-slate-950 border border-slate-700 text-white focus:border-indigo-500'
                        : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-indigo-600'
                    }`}
                  >
                    <option value="">Selecione um tema da disciplina...</option>
                    {currentDiscObj.temas.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                    <option value="__custom">+ Outro tema (Digitar manualmente)</option>
                  </select>

                  {selectedTema === '__custom' && (
                    <input
                      type="text"
                      required
                      value={customTema}
                      onChange={(e) => setCustomTema(e.target.value)}
                      placeholder="Digite o tema (ex: Segunda Lei de Newton)"
                      className={`w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all ${
                        isDark
                          ? 'bg-slate-950 border border-indigo-500 text-white'
                          : 'bg-slate-50 border border-indigo-600 text-slate-900'
                      }`}
                    />
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  required
                  value={customTema}
                  onChange={(e) => setCustomTema(e.target.value)}
                  placeholder="Ex: Teorema de Pitágoras, Oração Subordinada, Tabela Periódica..."
                  className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all ${
                    isDark
                      ? 'bg-slate-950 border border-slate-700 text-white focus:border-indigo-500'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-indigo-600'
                  }`}
                />
              )}
            </div>

            {/* 3. Nível e Pomodoro Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Nível Escolar / Académico
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Primaria', 'Médio', 'Superior'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setAcademicLevel(lvl)}
                      className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        academicLevel === lvl
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-500 dark:text-white ring-1 ring-indigo-500'
                          : isDark
                          ? 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-300'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Duração do Pomodoro
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 25, 45].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setSessionMinutes(mins)}
                      className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        sessionMinutes === mins
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-500 dark:text-white ring-1 ring-indigo-500'
                          : isDark
                          ? 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-300'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loadingStart}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
              >
                {loadingStart ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Conectando com Prof. Pacavira...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-white" />
                    <span>Iniciar Aula Interativa & Pomodoro</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* VIEW B: Active Interactive Classroom */
        <div className={`max-w-4xl mx-auto flex flex-col h-[750px] border rounded-3xl shadow-xl overflow-hidden transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* Top Bar with Pomodoro & Terminar Aula */}
          <div className={`px-5 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${
            isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-500 font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeDisciplinaName}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 font-semibold">
                    {academicLevel}
                  </span>
                </div>
                <h3 className={`text-sm font-semibold truncate max-w-xs sm:max-w-md ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {activeTemaName}
                </h3>
              </div>
            </div>

            {/* Pomodoro Timer Controls */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}>
                <Clock className={`w-4 h-4 ${isTimerRunning ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
                <span className={`font-mono text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {formatTime(timeLeft)}
                </span>
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`p-1 transition-colors cursor-pointer ${
                    isDark ? 'hover:text-white text-slate-400' : 'hover:text-slate-900 text-slate-500'
                  }`}
                  title={isTimerRunning ? 'Pausar' : 'Continuar'}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Terminar Aula Button */}
              <button
                type="button"
                onClick={() => setConfirmFinishOpen(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Terminar Aula</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Scrollable */}
          <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 ${
            isDark ? 'bg-slate-900/50' : 'bg-slate-50/50'
          }`}>
            {messages.map((msg) => {
              const isProf = msg.role === 'model';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isProf ? 'justify-start' : 'justify-end'}`}
                >
                  {isProf && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1 shadow-sm">
                      PP
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                      isProf
                        ? isDark
                          ? 'bg-slate-950/80 border border-slate-800 text-slate-200'
                          : 'bg-white border border-slate-200 text-slate-800 shadow-xs'
                        : 'bg-indigo-600 text-white rounded-br-xs shadow-md'
                    }`}
                  >
                    {isProf && (
                      <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-indigo-500">
                        <span>Prof. Pacavira</span>
                        <span className="text-[10px] text-slate-400 font-normal">{msg.timestamp}</span>
                      </div>
                    )}

                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {!isProf && (
                      <div className="text-[10px] text-indigo-200 text-right mt-1">
                        {msg.timestamp}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {sendingMessage && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1">
                  PP
                </div>
                <div className={`border rounded-2xl p-4 text-xs flex items-center gap-2 ${
                  isDark ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                  <span>Prof. Pacavira está digitando...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          <div className={`px-4 py-2 border-t flex items-center gap-2 overflow-x-auto text-xs no-scrollbar ${
            isDark ? 'bg-slate-950/50 border-slate-800/80' : 'bg-white border-slate-200'
          }`}>
            <span className="text-slate-400 text-[11px] font-semibold shrink-0">Sugestões rápidas:</span>
            {[
              'Dê um exemplo prático do dia a dia',
              'Não compreendi muito bem, pode simplificar?',
              'Faça uma pergunta para testar meu aprendizado',
              'Como este tema costuma cair nas provas?',
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSendMessage(suggestion)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium shrink-0 transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-white border-slate-700/80'
                    : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border-slate-200'
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <div className={`p-3 sm:p-4 border-t ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Tire dúvidas, responda ao professor ou peça exemplos..."
                className={`flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none transition-all ${
                  isDark
                    ? 'bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500'
                    : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600 shadow-xs'
                }`}
              />
              <button
                type="submit"
                disabled={!userInput.trim() || sendingMessage}
                className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                title="Enviar mensagem"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
