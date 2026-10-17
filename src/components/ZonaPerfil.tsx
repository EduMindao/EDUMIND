import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme, Theme } from '../context/ThemeContext.tsx';
import {
  UserProfile,
  saveUserProfile,
  EDUCATION_LEVELS,
  EducationLevel,
} from '../services/userService.ts';
import { Disciplina, Resumo, Tarefa } from '../services/studyService.ts';
import {
  User,
  Mail,
  GraduationCap,
  Sun,
  Moon,
  Check,
  Edit3,
  Save,
  X,
  Loader2,
  CheckCircle2,
  Target,
  Sparkles,
  BookOpen,
  FileText,
  Clock,
  LogOut,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

interface ZonaPerfilProps {
  userProfile: UserProfile | null;
  disciplinas: Disciplina[];
  resumos: Resumo[];
  tarefas: Tarefa[];
}

export const ZonaPerfil: React.FC<ZonaPerfilProps> = ({
  userProfile,
  disciplinas,
  resumos,
  tarefas,
}) => {
  const { currentUser, logout } = useAuth();
  const { theme, setTheme, isDark } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile?.name || currentUser?.displayName || '');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(
    userProfile?.educationLevel || 'Médio'
  );
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const studentName = userProfile?.name || currentUser?.displayName || 'Estudante';
  const studentEmail = currentUser?.email || userProfile?.email || 'Sem e-mail';
  const currentLevel = userProfile?.educationLevel || 'Médio';

  const totalPomodoroMinutes = resumos.reduce((acc, r) => acc + (r.sessionDurationMinutes || 25), 0);
  const tarefasFeitas = tarefas.filter((t) => t.status === 'feita');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!name.trim()) {
      setSaveError('Por favor, informe seu nome.');
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);
      await saveUserProfile({
        uid: currentUser.uid,
        name: name.trim(),
        email: studentEmail,
        educationLevel,
      });

      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      setSaveError(err.message || 'Erro ao atualizar dados do perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header bar */}
      <div className={`p-6 sm:p-8 rounded-3xl border transition-colors ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-indigo-600/30 border border-indigo-400/30 shrink-0">
              {studentName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isDark
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                }`}>
                  {currentLevel}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Conta Ativa
                </span>
              </div>
              <h1 className={`text-2xl sm:text-3xl font-extrabold font-['Outfit'] ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {studentName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">{studentEmail}</p>
            </div>
          </div>

          <div>
            {!isEditing ? (
              <button
                onClick={() => {
                  setName(userProfile?.name || currentUser?.displayName || '');
                  setEducationLevel(userProfile?.educationLevel || 'Médio');
                  setIsEditing(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Editar Dados</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
                  isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Perfil atualizado com sucesso no sistema da EduMind.AO!</span>
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <div className={`p-6 sm:p-7 rounded-3xl border animate-in fade-in ${
          isDark ? 'bg-slate-900 border-indigo-500/40 shadow-xl' : 'bg-white border-indigo-200 shadow-md'
        }`}>
          <h3 className={`text-lg font-bold font-['Outfit'] mb-4 flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <Edit3 className="w-5 h-5 text-indigo-500" />
            Editar Informações do Aluno
          </h3>

          {saveError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {saveError}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Nome Completo
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all ${
                  isDark
                    ? 'bg-slate-950 border border-slate-700 text-white focus:border-indigo-500'
                    : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-indigo-600'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Escolaridade
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {EDUCATION_LEVELS.map((lvl) => {
                  const isSelected = educationLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setEducationLevel(lvl)}
                      className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-400 ring-1 ring-indigo-500'
                          : isDark
                          ? 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-300'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="text-sm font-semibold">{lvl}</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {lvl === 'Primaria' ? 'Ensino Primário' : lvl === 'Médio' ? 'Ensino Médio' : 'Ensino Superior'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                  isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Salvar Alterações</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SEÇÃO 1: PREFERÊNCIAS DE APARÊNCIA (MODO CLARO E ESCURO) */}
      <div className={`p-6 sm:p-7 rounded-3xl border transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
            {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </div>
          <div>
            <h2 className={`text-lg sm:text-xl font-bold font-['Outfit'] ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Aparência do Aplicativo (Modo Claro & Escuro)
            </h2>
            <p className="text-xs text-slate-400">
              Personalize o tema visual da plataforma EduMind.AO de acordo com sua preferência de leitura.
            </p>
          </div>
        </div>

        {/* Theme Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Option: Modo Escuro */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
              isDark
                ? 'bg-slate-950 border-indigo-500 shadow-lg ring-2 ring-indigo-500/50'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isDark
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-slate-200 text-slate-700 border border-slate-300'
                  }`}>
                    <Moon className="w-5 h-5" />
                  </div>
                  <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Modo Escuro (Dark)
                  </span>
                </div>
                {isDark && (
                  <span className="p-1 rounded-full bg-indigo-600 text-white shadow-sm">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Paleta escura de alto contraste, ideal para estudar à noite e reduzir o cansaço visual durante longas sessões de Pomodoro.
              </p>
            </div>

            <div className={`mt-4 pt-3 border-t flex items-center gap-1.5 text-[11px] font-semibold ${
              isDark ? 'border-slate-800 text-indigo-400' : 'border-slate-200 text-slate-500'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-indigo-500' : 'bg-slate-400'}`}></span>
              {isDark ? 'Tema Ativo Atualmente' : 'Clique para Ativar Modo Escuro'}
            </div>
          </button>

          {/* Option: Modo Claro */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
              !isDark
                ? 'bg-indigo-50/50 border-indigo-600 shadow-lg ring-2 ring-indigo-600/40'
                : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    !isDark
                      ? 'bg-amber-100 text-amber-600 border border-amber-300'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    <Sun className="w-5 h-5" />
                  </div>
                  <span className={`font-bold text-sm ${!isDark ? 'text-slate-900' : 'text-slate-200'}`}>
                    Modo Claro (Light)
                  </span>
                </div>
                {!isDark && (
                  <span className="p-1 rounded-full bg-indigo-600 text-white shadow-sm">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <p className={`text-xs leading-relaxed ${!isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                Visual limpo com fundo claro, perfeito para leitura diurna e ambientes com bastante luz natural.
              </p>
            </div>

            <div className={`mt-4 pt-3 border-t flex items-center gap-1.5 text-[11px] font-semibold ${
              !isDark ? 'border-indigo-200 text-amber-700' : 'border-slate-800 text-slate-500'
            }`}>
              <span className={`w-2 h-2 rounded-full ${!isDark ? 'bg-amber-500' : 'bg-slate-600'}`}></span>
              {!isDark ? 'Tema Ativo Atualmente' : 'Clique para Ativar Modo Claro'}
            </div>
          </button>
        </div>
      </div>

      {/* SEÇÃO 2: PLANO DE ESTUDOS EDUMIND */}
      <div className={`p-6 sm:p-7 rounded-3xl border transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-lg sm:text-xl font-bold font-['Outfit'] ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Plano de Estudos EduMind
            </h2>
            <p className="text-xs text-slate-400">
              Diretrizes pedagógicas da sua jornada académica
            </p>
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
              {currentLevel === 'Primaria' ? 'Ensino Primário' : currentLevel === 'Médio' ? 'Ensino Médio' : 'Ensino Superior'}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Suas aulas com o Prof. Pacavira são calibradas para este grau de escolaridade.
            </span>
          </div>

          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-indigo-950/30 border-indigo-500/30' : 'bg-indigo-50/70 border-indigo-200'
          }`}>
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
              Meta Principal
            </span>
            <span className={`text-base font-bold block ${isDark ? 'text-indigo-200' : 'text-indigo-900'}`}>
              Resultados
            </span>
            <span className={`text-xs mt-1 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Foco no aperfeiçoamento contínuo, memorização ativa e alto desempenho.
            </span>
          </div>
        </div>
      </div>

      {/* SEÇÃO 3: ESTATÍSTICAS DO ALUNO */}
      <div className={`p-6 sm:p-7 rounded-3xl border transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <h3 className={`text-base font-bold font-['Outfit'] mb-4 flex items-center gap-2 ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Histórico Acumulado de Aprendizagem
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className={`p-4 rounded-2xl border text-center ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <BookOpen className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
            <span className={`text-xl font-extrabold block font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {disciplinas.length}
            </span>
            <span className="text-[11px] text-slate-400">Disciplinas</span>
          </div>

          <div className={`p-4 rounded-2xl border text-center ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <Clock className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
            <span className={`text-xl font-extrabold block font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {totalPomodoroMinutes}m
            </span>
            <span className="text-[11px] text-slate-400">Tempo Pomodoro</span>
          </div>

          <div className={`p-4 rounded-2xl border text-center ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <FileText className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
            <span className={`text-xl font-extrabold block font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {resumos.length}
            </span>
            <span className="text-[11px] text-slate-400">Resumos Salvos</span>
          </div>

          <div className={`p-4 rounded-2xl border text-center ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
            <span className={`text-xl font-extrabold block font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {tarefasFeitas.length}
            </span>
            <span className="text-[11px] text-slate-400">Tarefas Feitas</span>
          </div>
        </div>
      </div>

      {/* SEÇÃO 4: GERENCIAR CONTA */}
      <div className={`p-6 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-100/70 border-slate-200'
      }`}>
        <div>
          <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Gerenciamento de Sessão
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Deseja sair da sua conta EduMind.AO neste dispositivo?
          </p>
        </div>

        <button
          onClick={() => logout()}
          className="px-5 py-2.5 rounded-xl bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>Encerrar Sessão</span>
        </button>
      </div>
    </div>
  );
};
