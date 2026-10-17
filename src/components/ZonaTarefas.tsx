import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';
import { Tarefa, completeTarefa, reopenTarefa, deleteTarefa } from '../services/studyService.ts';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Trash2,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ListTodo,
} from 'lucide-react';

interface ZonaTarefasProps {
  tarefas: Tarefa[];
  onStartStudy: (disciplina?: string, tema?: string) => void;
}

export const ZonaTarefas: React.FC<ZonaTarefasProps> = ({ tarefas, onStartStudy }) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'pendentes' | 'feitas'>('pendentes');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [evaluatedTasks, setEvaluatedTasks] = useState<Record<string, { isCorrect: boolean; explanation: string }>>({});

  const pendentes = tarefas.filter((t) => t.status === 'pendente');
  const feitas = tarefas.filter((t) => t.status === 'feita');

  const handleSelectOption = (tarefaId: string, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [tarefaId]: option }));
  };

  const handleAnswerTask = async (tarefa: Tarefa) => {
    const selected = selectedAnswers[tarefa.id];
    if (!selected && tarefa.options && tarefa.options.length > 0) {
      return;
    }

    // Check correctness if options/correctAnswer exist
    const isCorrect = tarefa.correctAnswer
      ? selected?.trim().toLowerCase().startsWith(tarefa.correctAnswer.trim().toLowerCase()) ||
        selected === tarefa.correctAnswer
      : true;

    setEvaluatedTasks((prev) => ({
      ...prev,
      [tarefa.id]: {
        isCorrect: Boolean(isCorrect),
        explanation: tarefa.explanation || 'Excelente dedicação na resolução da tarefa!',
      },
    }));

    await completeTarefa(tarefa.id, selected, isCorrect);
  };

  const handleSimpleComplete = async (tarefaId: string) => {
    await completeTarefa(tarefaId, 'Concluída pelo aluno', true);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border transition-colors ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
              isDark
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              Prática & Fixação
            </span>
          </div>
          <h2 className={`text-2xl font-extrabold font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Zona de Tarefas & Exercícios
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Resolva os exercícios gerados pelo Prof. Pacavira após suas aulas para fixar o conteúdo.
          </p>
        </div>

        {/* 2 Zones Switcher */}
        <div className={`flex items-center gap-1.5 p-1 rounded-2xl border self-start sm:self-auto ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => setActiveTab('pendentes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'pendentes'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Tarefas Pendentes ({pendentes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('feitas')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'feitas'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Tarefas Feitas ({feitas.length})</span>
          </button>
        </div>
      </div>

      {/* Content for Active Tab */}
      {activeTab === 'pendentes' ? (
        /* TAB 1: TAREFAS PENDENTES */
        <div className="space-y-4">
          {pendentes.length === 0 ? (
            <div className={`p-12 text-center rounded-3xl border border-dashed space-y-4 ${
              isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-300 shadow-sm'
            }`}>
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Todas as tarefas em dia!
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-1">
                  Você não tem nenhuma tarefa pendente no momento. Inicie uma nova aula com o Prof. Pacavira para gerar novos desafios.
                </p>
              </div>
              <button
                onClick={() => onStartStudy()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Ir para Zona de Estudo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pendentes.map((tarefa, index) => {
                const selectedOption = selectedAnswers[tarefa.id];
                return (
                  <div
                    key={tarefa.id}
                    className={`border rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between transition-colors ${
                      isDark
                        ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        : 'bg-white border-slate-200 hover:border-indigo-200'
                    }`}
                  >
                    <div>
                      {/* Badge info */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            isDark
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}>
                            {tarefa.disciplina}
                          </span>
                          <span className="text-xs text-slate-400 truncate max-w-[150px]">
                            {tarefa.tema}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                          Pendente #{index + 1}
                        </span>
                      </div>

                      {/* Question / Task title */}
                      <h3 className={`font-bold text-base font-['Outfit'] mb-2 leading-snug ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {tarefa.title}
                      </h3>

                      {tarefa.description && (
                        <p className={`text-xs mb-4 leading-relaxed ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {tarefa.description}
                        </p>
                      )}

                      {/* Options (if multiple choice) */}
                      {tarefa.options && tarefa.options.length > 0 && (
                        <div className="space-y-2 mb-4 pt-1">
                          {tarefa.options.map((opt, i) => {
                            const isSelected = selectedOption === opt;
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleSelectOption(tarefa.id, opt)}
                                className={`w-full p-3 rounded-xl border text-xs text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                                  isSelected
                                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-600 dark:text-white shadow-sm ring-1 ring-indigo-500'
                                    : isDark
                                    ? 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                                }`}
                              >
                                <span
                                  className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white'
                                      : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                                  }`}
                                >
                                  {String.fromCharCode(65 + i)}
                                </span>
                                <span className="flex-1 leading-snug">{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className={`pt-4 border-t flex items-center justify-between gap-3 ${
                      isDark ? 'border-slate-800/80' : 'border-slate-200'
                    }`}>
                      <button
                        onClick={() => deleteTarefa(tarefa.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                        title="Descartar tarefa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-2">
                        {(!tarefa.options || tarefa.options.length === 0) && (
                          <button
                            onClick={() => handleSimpleComplete(tarefa.id)}
                            className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-600 dark:text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Marcar como Feita</span>
                          </button>
                        )}

                        {tarefa.options && tarefa.options.length > 0 && (
                          <button
                            onClick={() => handleAnswerTask(tarefa)}
                            disabled={!selectedOption}
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Responder e Concluir</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* TAB 2: TAREFAS FEITAS */
        <div className="space-y-4">
          {feitas.length === 0 ? (
            <div className={`p-12 text-center rounded-3xl border border-dashed space-y-4 ${
              isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-300 shadow-sm'
            }`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${
                isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
              }`}>
                <ListTodo className="w-8 h-8" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Nenhuma tarefa feita ainda
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-1">
                  Responda às tarefas na aba "Tarefas Pendentes" para construir seu histórico de acertos e revisão.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('pendentes')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
              >
                Ver Tarefas Pendentes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {feitas.map((tarefa) => (
                <div
                  key={tarefa.id}
                  className={`border rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between transition-colors ${
                    isDark
                      ? 'bg-slate-900/80 border-emerald-500/20'
                      : 'bg-white border-emerald-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          isDark
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {tarefa.disciplina}
                        </span>
                        <span className="text-xs text-slate-400 truncate max-w-[150px]">
                          {tarefa.tema}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Concluída
                      </span>
                    </div>

                    <h3 className={`font-bold text-base font-['Outfit'] mb-2 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {tarefa.title}
                    </h3>

                    {tarefa.studentAnswer && (
                      <div className={`p-3 rounded-xl border text-xs mb-3 space-y-1 ${
                        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                          Sua Resposta:
                        </span>
                        <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          {tarefa.studentAnswer}
                        </span>
                      </div>
                    )}

                    {tarefa.explanation && (
                      <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                        isDark ? 'bg-indigo-950/40 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'
                      }`}>
                        <span className="text-indigo-500 font-bold flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5" />
                          Comentário do Prof. Pacavira:
                        </span>
                        <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {tarefa.explanation}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className={`pt-4 border-t flex items-center justify-between gap-3 text-xs mt-4 ${
                    isDark ? 'border-slate-800/80 text-slate-500' : 'border-slate-200 text-slate-500'
                  }`}>
                    <span>
                      Feita em {tarefa.completedAt ? new Date(tarefa.completedAt).toLocaleDateString('pt-BR') : 'Hoje'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => reopenTarefa(tarefa.id)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isDark
                            ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                            : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                        }`}
                        title="Refazer tarefa"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Refazer</span>
                      </button>

                      <button
                        onClick={() => deleteTarefa(tarefa.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
