import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase.ts';

export interface Disciplina {
  id: string;
  userId: string;
  name: string;
  color?: string;
  temas: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Resumo {
  id: string;
  userId: string;
  disciplina: string;
  tema: string;
  academicLevel: string;
  content: string;
  keyTakeaways: string[];
  sessionDurationMinutes: number;
  createdAt: string;
}

export interface Tarefa {
  id: string;
  userId: string;
  disciplina: string;
  tema: string;
  title: string;
  description?: string;
  academicLevel: string;
  status: 'pendente' | 'feita';
  options?: string[];
  correctAnswer?: string;
  studentAnswer?: string;
  explanation?: string;
  isCorrect?: boolean;
  completedAt?: string;
  createdAt: string;
}

// Default suggested disciplines for new students on EduMind.AO
export const DEFAULT_DISCIPLINAS: { name: string; color: string; temas: string[] }[] = [
  {
    name: 'Matemática',
    color: 'from-blue-600 to-indigo-700',
    temas: ['Funções e Gráficos', 'Geometria Plana e Espacial', 'Trigonometria', 'Probabilidade e Estatística'],
  },
  {
    name: 'Língua Portuguesa',
    color: 'from-emerald-600 to-teal-700',
    temas: ['Interpretação e Compreensão de Texto', 'Sintaxe e Pontuação', 'Figuras de Estilo', 'Redação Dissertativa'],
  },
  {
    name: 'Física',
    color: 'from-amber-600 to-orange-700',
    temas: ['Cinemática e Movimento', 'Leis de Newton', 'Termodinâmica', 'Eletricidade e Circuitos'],
  },
  {
    name: 'Química',
    color: 'from-purple-600 to-pink-700',
    temas: ['Estrutura Atômica e Tabela Periódica', 'Ligações Químicas', 'Estequiometria', 'Química Orgânica'],
  },
  {
    name: 'Biologia',
    color: 'from-lime-600 to-green-700',
    temas: ['Citologia e Estrutura Celular', 'Genética e Hereditariedade', 'Ecologia e Meio Ambiente', 'Fisiologia Humana'],
  },
  {
    name: 'História',
    color: 'from-rose-600 to-red-700',
    temas: ['História de Angola e África', 'Grandes Navegações e Colonização', 'Primeira e Segunda Guerra Mundial', 'Mundo Contemporâneo'],
  },
];

/* ---------------- DISCIPLINAS ---------------- */

export async function getDisciplinas(userId: string): Promise<Disciplina[]> {
  const path = 'disciplinas';
  try {
    const q = query(collection(db, path), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Disciplina);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export function subscribeDisciplinas(
  userId: string,
  onData: (disciplinas: Disciplina[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'disciplinas';
  const q = query(collection(db, path), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((d) => d.data() as Disciplina));
    },
    (err) => {
      try {
        handleFirestoreError(err, OperationType.LIST, path);
      } catch (e: any) {
        if (onError) onError(e);
      }
    }
  );
}

export async function addDisciplina(userId: string, name: string, temas: string[] = []): Promise<Disciplina> {
  const path = 'disciplinas';
  try {
    const id = `disc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const colors = [
      'from-blue-600 to-indigo-700',
      'from-emerald-600 to-teal-700',
      'from-amber-600 to-orange-700',
      'from-purple-600 to-pink-700',
      'from-rose-600 to-red-700',
      'from-cyan-600 to-blue-700',
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const newDisc: Disciplina = {
      id,
      userId,
      name: name.trim(),
      color,
      temas: temas.map((t) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, path, id), newDisc);
    return newDisc;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function addTemaToDisciplina(disciplinaId: string, tema: string, currentTemas: string[]): Promise<void> {
  const path = `disciplinas/${disciplinaId}`;
  try {
    const trimmed = tema.trim();
    if (!trimmed || currentTemas.includes(trimmed)) return;
    const updated = [...currentTemas, trimmed];
    await updateDoc(doc(db, 'disciplinas', disciplinaId), {
      temas: updated,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function removeTemaFromDisciplina(disciplinaId: string, tema: string, currentTemas: string[]): Promise<void> {
  const path = `disciplinas/${disciplinaId}`;
  try {
    const updated = currentTemas.filter((t) => t !== tema);
    await updateDoc(doc(db, 'disciplinas', disciplinaId), {
      temas: updated,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteDisciplina(disciplinaId: string): Promise<void> {
  const path = `disciplinas/${disciplinaId}`;
  try {
    await deleteDoc(doc(db, 'disciplinas', disciplinaId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/* ---------------- RESUMOS ---------------- */

export function subscribeResumos(
  userId: string,
  onData: (resumos: Resumo[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'resumos';
  const q = query(collection(db, path), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => d.data() as Resumo);
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onData(list);
    },
    (err) => {
      try {
        handleFirestoreError(err, OperationType.LIST, path);
      } catch (e: any) {
        if (onError) onError(e);
      }
    }
  );
}

export async function saveResumo(resumo: Omit<Resumo, 'id' | 'createdAt'>): Promise<Resumo> {
  const path = 'resumos';
  try {
    const id = `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const fullResumo: Resumo = {
      ...resumo,
      id,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, path, id), fullResumo);
    return fullResumo;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteResumo(resumoId: string): Promise<void> {
  const path = `resumos/${resumoId}`;
  try {
    await deleteDoc(doc(db, 'resumos', resumoId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/* ---------------- TAREFAS ---------------- */

export function subscribeTarefas(
  userId: string,
  onData: (tarefas: Tarefa[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'tarefas';
  const q = query(collection(db, path), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => d.data() as Tarefa);
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onData(list);
    },
    (err) => {
      try {
        handleFirestoreError(err, OperationType.LIST, path);
      } catch (e: any) {
        if (onError) onError(e);
      }
    }
  );
}

export async function saveTarefasBatch(
  userId: string,
  disciplina: string,
  tema: string,
  academicLevel: string,
  tasks: Array<{
    title: string;
    description?: string;
    options?: string[];
    correctAnswer?: string;
    explanation?: string;
  }>
): Promise<Tarefa[]> {
  const path = 'tarefas';
  try {
    const savedList: Tarefa[] = [];
    for (const task of tasks) {
      const id = `tar_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const newTarefa: Tarefa = {
        id,
        userId,
        disciplina,
        tema,
        title: task.title,
        description: task.description || '',
        academicLevel,
        status: 'pendente',
        options: task.options || [],
        correctAnswer: task.correctAnswer || '',
        explanation: task.explanation || '',
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, path, id), newTarefa);
      savedList.push(newTarefa);
    }
    return savedList;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function completeTarefa(
  tarefaId: string,
  studentAnswer?: string,
  isCorrect?: boolean
): Promise<void> {
  const path = `tarefas/${tarefaId}`;
  try {
    await updateDoc(doc(db, 'tarefas', tarefaId), {
      status: 'feita',
      studentAnswer: studentAnswer || '',
      isCorrect: isCorrect ?? true,
      completedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function reopenTarefa(tarefaId: string): Promise<void> {
  const path = `tarefas/${tarefaId}`;
  try {
    await updateDoc(doc(db, 'tarefas', tarefaId), {
      status: 'pendente',
      completedAt: null,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteTarefa(tarefaId: string): Promise<void> {
  const path = `tarefas/${tarefaId}`;
  try {
    await deleteDoc(doc(db, 'tarefas', tarefaId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/* ---------------- PROF. PACAVIRA AI CLIENT CALLS ---------------- */

export async function startLessonAI(params: {
  subject: string;
  topic: string;
  academicLevel: string;
}): Promise<{ message: string; professor: string }> {
  const res = await fetch('/api/ai/start-lesson', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Erro ao conectar com Prof. Pacavira');
  }
  return res.json();
}

export async function chatLessonAI(params: {
  subject: string;
  topic: string;
  academicLevel: string;
  messages: Array<{ role: 'user' | 'model'; text: string }>;
}): Promise<{ message: string; professor: string }> {
  const res = await fetch('/api/ai/chat-lesson', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Erro na resposta do Prof. Pacavira');
  }
  return res.json();
}

export async function finishLessonAI(params: {
  subject: string;
  topic: string;
  academicLevel: string;
  durationMinutes: number;
  messages: Array<{ role: 'user' | 'model'; text: string }>;
}): Promise<{
  summaryMarkdown: string;
  keyTakeaways: string[];
  tasks: Array<{
    title: string;
    description?: string;
    options?: string[];
    correctAnswer?: string;
    explanation?: string;
  }>;
}> {
  const res = await fetch('/api/ai/finish-lesson', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Erro ao finalizar aula e gerar resumo/tarefas');
  }
  return res.json();
}
