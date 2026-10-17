import React from 'react';
import { useTheme } from '../context/ThemeContext.tsx';
import { UserProfile } from '../services/userService.ts';
import { Disciplina, Resumo, Tarefa } from '../services/studyService.ts';
import {
  Brain,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  GraduationCap,
  ListTodo,
  TrendingUp,
  Target,
  FileText,
  CheckSquare,
} from 'lucide-react';

interface DashboardOverviewProps {
  userProfile: UserProfile | null;
  currentUserDisplayName?: string | null;
  disciplinas: Disciplina[];
  resumos: Resumo[];
  tarefas: Tarefa[];
  onNavigateTab: (tab: 'disciplinas' | 'estudo' | 'resumos' | 'tarefas' | 'perfil') => void;
  onSelectTemaForStudy: (disciplina: string, tema: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  userProfile,
  currentUserDisplayName,
  disciplinas,
  resumos,
  tarefas,
  onNavigateTab,
  onSelectTemaForStudy,
}) => {
  const { isDark } = useTheme();
  const studentName = userProfile?.name || currentUserDisplayName || 'Estudante';
  const educationLevel = userProfile?.educationLevel || 'Médio';

  const totalTemas = disciplinas.reduce((acc, d) => acc + (d.temas?.length || 0), 0);
  const totalPomodoroMinutes = resumos.reduce((acc, r) => acc + (r.sessionDurationMinutes || 25), 0);
  const tarefasPendentes = tarefas.filter((t) => t.status === 'pendente');
  const tarefasFeitas = tarefas.filter((t) => t.status === 'feita');
  const taskCompletionRate =
    tarefas.length > 0 ? Math.round((tarefasFeitas.length / tarefas.length) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 shadow-xl transition-colors ${
        isDark
          ? 'bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 border-indigo-500/25'
          : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50/50 border-indigo-200'
      }`}>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isDark
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-indigo-100/80 text-indigo-800 border border-indigo-200'
              }`}>
                <GraduationCap className="w-3.5 h-3.5" />
                Escolaridade: {educationLevel}
              </span>
              <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                EduMind.AO
              </span>
            </div>

            <h1 className={`text-2xl sm:text-4xl font-extrabold font-['Outfit'] tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Olá, {studentName}!
            </h1>
            <p className={`text-xs sm:text-sm max-w-xl leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Aqui está o resumo completo das suas atividades na plataforma. Continue estudando com o{' '}
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>Prof. Pacavira</strong> para transformar seu foco em resultados.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('estudo')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Brain className="w-4 h-4" />
              <span>Estudar Agora com Prof. Pacavira</span>
            </button>
          </div>
        </div>
      </div>

      {/* Resumo das Atividades na Plataforma (4 Key Metrics) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg sm:text-xl font-bold font-['Outfit'] flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            Resumo das Actividades na Plataforma
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* 1. Disciplinas & Temas */}
          <div
            onClick={() => onNavigateTab('disciplinas')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer group shadow-sm ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/40'
                : 'bg-white border-slate-200 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <ArrowRight className={`w-4 h-4 transition-colors ${
                isDark ? 'text-slate-600 group-hover:text-indigo-400' : 'text-slate-400 group-hover:text-indigo-600'
              }`} />
            </div>
            <div className={`text-2xl sm:text-3xl font-extrabold font-['Outfit'] ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {disciplinas.length}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Disciplinas Cadastradas</p>
            <span className="text-[11px] text-slate-500 block mt-1">
              {totalTemas} temas cadastrados
            </span>
          </div>

          {/* 2. Tempo Pomodoro */}
          <div
            onClick={() => onNavigateTab('estudo')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer group shadow-sm ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/40'
                : 'bg-white border-slate-200 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <ArrowRight className={`w-4 h-4 transition-colors ${
                isDark ? 'text-slate-600 group-hover:text-amber-400' : 'text-slate-400 group-hover:text-amber-600'
              }`} />
            </div>
            <div className={`text-2xl sm:text-3xl font-extrabold font-['Outfit'] ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {totalPomodoroMinutes} <span className="text-sm font-semibold text-slate-400">min</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Tempo Pomodoro com IA</p>
            <span className="text-[11px] text-slate-500 block mt-1">
              {resumos.length} aulas finalizadas
            </span>
          </div>

          {/* 3. Resumos Gerados */}
          <div
            onClick={() => onNavigateTab('resumos')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer group shadow-sm ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/40'
                : 'bg-white border-slate-200 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <ArrowRight className={`w-4 h-4 transition-colors ${
                isDark ? 'text-slate-600 group-hover:text-cyan-400' : 'text-slate-400 group-hover:text-cyan-600'
              }`} />
            </div>
            <div className={`text-2xl sm:text-3xl font-extrabold font-['Outfit'] ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {resumos.length}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Resumos no Acervo</p>
            <span className="text-[11px] text-cyan-500 block mt-1">
              Prontos para revisão
            </span>
          </div>

          {/* 4. Tarefas Concluídas */}
          <div
            onClick={() => onNavigateTab('tarefas')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer group shadow-sm ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/40'
                : 'bg-white border-slate-200 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <ArrowRight className={`w-4 h-4 transition-colors ${
                isDark ? 'text-slate-600 group-hover:text-emerald-400' : 'text-slate-400 group-hover:text-emerald-600'
              }`} />
            </div>
            <div className={`text-2xl sm:text-3xl font-extrabold font-['Outfit'] ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {tarefasFeitas.length}{' '}
              <span className="text-sm font-semibold text-slate-400">/ {tarefas.length}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Tarefas Feitas</p>
            <div className={`w-full h-1.5 rounded-full overflow-hidden mt-2 ${
              isDark ? 'bg-slate-800' : 'bg-slate-200'
            }`}>
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${taskCompletionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Plano de Estudos EduMind (Com Meta Principal: Resultados) */}
      <div className={`rounded-3xl p-6 sm:p-7 border transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-lg font-bold font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Plano de Estudos EduMind
              </h3>
              <p className="text-xs text-slate-400">
                Configurações da sua trajetória pedagógica personalizada
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Escolaridade
            </span>
            <span className={`text-base font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {educationLevel === 'Primaria' ? 'Ensino Primário' : educationLevel === 'Médio' ? 'Ensino Médio' : 'Ensino Superior'}
            </span>
            <span className="text-xs text-slate-400 mt-0.5 block">
              Aulas e resumos calibrados especificamente para seu nível
            </span>
          </div>

          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-indigo-950/30 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'
          }`}>
            <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider block mb-1">
              Meta Principal
            </span>
            <span className={`text-base font-bold block ${isDark ? 'text-indigo-200' : 'text-indigo-900'}`}>
              Resultados
            </span>
            <span className={`text-xs mt-0.5 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Foco contínuo em aprendizagem ativa, retenção e aprovação
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity Sections Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recentes Resumos */}
        <div className={`rounded-3xl p-6 border flex flex-col justify-between transition-colors ${
          isDark ? 'bg-slate-900/80 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-base font-['Outfit'] flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <FileText className="w-4 h-4 text-cyan-500" />
                Últimos Resumos Gerados
              </h3>
              <button
                onClick={() => onNavigateTab('resumos')}
                className="text-xs text-indigo-600 hover:text-indigo-500 font-semibold cursor-pointer"
              >
                Ver todos ({resumos.length})
              </button>
            </div>

            {resumos.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center italic">
                Nenhum resumo gerado ainda. Conclua uma aula na Zona de Estudo.
              </p>
            ) : (
              <div className="space-y-2.5">
                {resumos.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    onClick={() => onNavigateTab('resumos')}
                    className={`p-3.5 rounded-2xl border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                      isDark
                        ? 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                        {r.disciplina}
                      </span>
                      <h4 className={`text-xs sm:text-sm font-semibold mt-1 ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {r.tema}
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {new Date(r.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`pt-4 mt-4 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
            <button
              onClick={() => onNavigateTab('estudo')}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>Gerar Novo Resumo com Prof. Pacavira</span>
            </button>
          </div>
        </div>

        {/* Tarefas Pendentes */}
        <div className={`rounded-3xl p-6 border flex flex-col justify-between transition-colors ${
          isDark ? 'bg-slate-900/80 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-base font-['Outfit'] flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <ListTodo className="w-4 h-4 text-amber-500" />
                Tarefas Pendentes
              </h3>
              <button
                onClick={() => onNavigateTab('tarefas')}
                className="text-xs text-indigo-600 hover:text-indigo-500 font-semibold cursor-pointer"
              >
                Ver tarefas ({tarefasPendentes.length})
              </button>
            </div>

            {tarefasPendentes.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <span>Excelente! Não há nenhuma tarefa pendente no momento.</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {tarefasPendentes.slice(0, 3).map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onNavigateTab('tarefas')}
                    className={`p-3.5 rounded-2xl border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                      isDark
                        ? 'bg-slate-950/70 border-slate-800/80 hover:border-amber-500/30'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                          {t.disciplina}
                        </span>
                        <span className="text-xs text-slate-400 truncate max-w-[150px]">
                          {t.tema}
                        </span>
                      </div>
                      <h4 className={`text-xs sm:text-sm font-semibold mt-1 line-clamp-1 ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {t.title}
                      </h4>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`pt-4 mt-4 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
            <button
              onClick={() => onNavigateTab('tarefas')}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-amber-500" />
              <span>Resolver Tarefas Pendentes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
