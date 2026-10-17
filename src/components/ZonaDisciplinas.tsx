import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';
import {
  Disciplina,
  addDisciplina,
  addTemaToDisciplina,
  removeTemaFromDisciplina,
  deleteDisciplina,
  DEFAULT_DISCIPLINAS,
} from '../services/studyService.ts';
import {
  BookOpen,
  Plus,
  Trash2,
  FolderPlus,
  Sparkles,
  ArrowRight,
  BookMarked,
  X,
  Check,
} from 'lucide-react';

interface ZonaDisciplinasProps {
  disciplinas: Disciplina[];
  userId: string;
  onSelectTemaForStudy: (disciplina: string, tema: string) => void;
}

export const ZonaDisciplinas: React.FC<ZonaDisciplinasProps> = ({
  disciplinas,
  userId,
  onSelectTemaForStudy,
}) => {
  const { isDark } = useTheme();
  const [newDiscName, setNewDiscName] = useState('');
  const [isAddingDisc, setIsAddingDisc] = useState(false);
  const [selectedDiscForTema, setSelectedDiscForTema] = useState<string | null>(null);
  const [newTemaName, setNewTemaName] = useState('');
  const [loadingDefaults, setLoadingDefaults] = useState(false);

  const handleCreateDisciplina = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscName.trim()) return;
    await addDisciplina(userId, newDiscName.trim());
    setNewDiscName('');
    setIsAddingDisc(false);
  };

  const handleAddTema = async (disciplina: Disciplina) => {
    if (!newTemaName.trim()) return;
    await addTemaToDisciplina(disciplina.id, newTemaName.trim(), disciplina.temas || []);
    setNewTemaName('');
    setSelectedDiscForTema(null);
  };

  const handleLoadDefaults = async () => {
    try {
      setLoadingDefaults(true);
      for (const def of DEFAULT_DISCIPLINAS) {
        // Only add if not already present
        if (!disciplinas.some((d) => d.name.toLowerCase() === def.name.toLowerCase())) {
          await addDisciplina(userId, def.name, def.temas);
        }
      }
    } finally {
      setLoadingDefaults(false);
    }
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
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
            }`}>
              Organização Académica
            </span>
          </div>
          <h2 className={`text-2xl font-extrabold font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Zona de Disciplinas & Temas
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Adicione disciplinas curriculares e cadastre temas para estudar com o Prof. Pacavira.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {disciplinas.length === 0 && (
            <button
              onClick={handleLoadDefaults}
              disabled={loadingDefaults}
              className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Sugerir Disciplinas</span>
            </button>
          )}

          <button
            onClick={() => setIsAddingDisc(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Disciplina</span>
          </button>
        </div>
      </div>

      {/* Modal / Inline Add Disciplina */}
      {isAddingDisc && (
        <div className={`p-5 rounded-2xl border shadow-xl animate-in fade-in transition-colors ${
          isDark ? 'bg-slate-900 border-indigo-500/40' : 'bg-white border-indigo-200 shadow-md'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <FolderPlus className="w-4 h-4 text-indigo-500" />
              Cadastrar Nova Disciplina
            </h3>
            <button
              onClick={() => setIsAddingDisc(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleCreateDisciplina} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              autoFocus
              value={newDiscName}
              onChange={(e) => setNewDiscName(e.target.value)}
              placeholder="Ex: Filosofia, Literatura, Informática, Química Orgânica..."
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all ${
                isDark
                  ? 'bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500'
                  : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600'
              }`}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsAddingDisc(false)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                  isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Salvar Disciplina
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Disciplines Grid */}
      {disciplinas.length === 0 ? (
        <div className={`p-12 text-center rounded-3xl border border-dashed space-y-4 ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-300 shadow-sm'
        }`}>
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto border border-indigo-500/20">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Nenhuma disciplina cadastrada ainda
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-1">
              Cadastre suas matérias escolares ou acadêmicas e defina os temas de estudo para iniciar suas aulas com o Prof. Pacavira.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsAddingDisc(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
            >
              Criar Primeira Disciplina
            </button>
            <button
              onClick={handleLoadDefaults}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              Carregar Disciplinas Sugeridas
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {disciplinas.map((disc) => {
            const isAddingTema = selectedDiscForTema === disc.id;
            return (
              <div
                key={disc.id}
                className={`border rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all group ${
                  isDark
                    ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-indigo-200 shadow-sm'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
                        <BookMarked className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`font-extrabold text-lg font-['Outfit'] transition-colors ${
                          isDark ? 'text-white group-hover:text-indigo-300' : 'text-slate-900 group-hover:text-indigo-600'
                        }`}>
                          {disc.name}
                        </h3>
                        <span className="text-xs text-slate-400">
                          {disc.temas?.length || 0} {(disc.temas?.length || 0) === 1 ? 'tema' : 'temas'} cadastrados
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteDisciplina(disc.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Excluir disciplina"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Temas List */}
                  <div className="space-y-2 mb-4">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Temas para Estudar:
                    </label>

                    {disc.temas && disc.temas.length > 0 ? (
                      <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                        {disc.temas.map((tema) => (
                          <div
                            key={tema}
                            className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-colors group/tema ${
                              isDark
                                ? 'bg-slate-950/70 border-slate-800/80 hover:border-indigo-500/40 text-slate-300'
                                : 'bg-slate-50 border-slate-200 hover:border-indigo-300 text-slate-700'
                            }`}
                          >
                            <span className="font-medium truncate flex-1 mr-2">
                              {tema}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => onSelectTemaForStudy(disc.name, tema)}
                                className="px-2 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-500 hover:text-white font-semibold text-[10px] flex items-center gap-1 transition-all cursor-pointer"
                                title="Estudar este tema na Zona de Estudo"
                              >
                                <span>Estudar</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() =>
                                  removeTemaFromDisciplina(disc.id, tema, disc.temas)
                                }
                                className="p-1 text-slate-400 hover:text-rose-500 transition-colors opacity-60 group-hover/tema:opacity-100 cursor-pointer"
                                title="Remover tema"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic py-2">
                        Nenhum tema adicionado ainda. Adicione temas para estudar.
                      </p>
                    )}
                  </div>
                </div>

                {/* Add Tema Input or Trigger */}
                <div className={`pt-3 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                  {isAddingTema ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        autoFocus
                        value={newTemaName}
                        onChange={(e) => setNewTemaName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddTema(disc);
                          if (e.key === 'Escape') setSelectedDiscForTema(null);
                        }}
                        placeholder="Nome do tema (ex: Termodinâmica)"
                        className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none ${
                          isDark
                            ? 'bg-slate-950 border-indigo-500 text-white placeholder-slate-500'
                            : 'bg-slate-50 border-indigo-600 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedDiscForTema(null)}
                          className="px-2.5 py-1 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-medium cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddTema(disc)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Salvar Tema
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedDiscForTema(disc.id);
                        setNewTemaName('');
                      }}
                      className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isDark
                          ? 'bg-slate-800/60 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-300 border-slate-800 hover:border-indigo-500/30'
                          : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border-slate-200 hover:border-indigo-200'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar Tema nesta Disciplina</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
