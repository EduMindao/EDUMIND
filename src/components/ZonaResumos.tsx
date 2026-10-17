import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';
import { Resumo, deleteResumo } from '../services/studyService.ts';
import {
  BookOpen,
  Search,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  X,
  FileText,
} from 'lucide-react';

interface ZonaResumosProps {
  resumos: Resumo[];
  onStartStudy: (disciplina?: string, tema?: string) => void;
}

export const ZonaResumos: React.FC<ZonaResumosProps> = ({ resumos, onStartStudy }) => {
  const { isDark } = useTheme();
  const [search, setSearch] = useState('');
  const [selectedDisciplina, setSelectedDisciplina] = useState<string>('todos');
  const [readingResumo, setReadingResumo] = useState<Resumo | null>(null);
  const [copied, setCopied] = useState(false);

  // Extract unique disciplines
  const uniqueDisciplinas = Array.from(new Set(resumos.map((r) => r.disciplina)));

  const filtered = resumos.filter((r) => {
    const matchesSearch =
      r.tema.toLowerCase().includes(search.toLowerCase()) ||
      r.disciplina.toLowerCase().includes(search.toLowerCase()) ||
      r.content.toLowerCase().includes(search.toLowerCase());
    const matchesDisc = selectedDisciplina === 'todos' || r.disciplina === selectedDisciplina;
    return matchesSearch && matchesDisc;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
            }`}>
              Acervo de Aprendizado
            </span>
          </div>
          <h2 className={`text-2xl font-extrabold font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Zona de Resumos de Aulas
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Todos os resumos didáticos gerados pelo Prof. Pacavira salvos para sua revisão contínua.
          </p>
        </div>

        <button
          onClick={() => onStartStudy()}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Nova Aula / Gerar Resumo</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por tema, disciplina ou palavra-chave..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none transition-all ${
              isDark
                ? 'bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500'
                : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600 shadow-xs'
            }`}
          />
        </div>

        {uniqueDisciplinas.length > 0 && (
          <select
            value={selectedDisciplina}
            onChange={(e) => setSelectedDisciplina(e.target.value)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none cursor-pointer ${
              isDark
                ? 'bg-slate-900 border border-slate-800 text-white focus:border-indigo-500'
                : 'bg-white border border-slate-300 text-slate-900 focus:border-indigo-600 shadow-xs'
            }`}
          >
            <option value="todos">Todas as Disciplinas ({resumos.length})</option>
            {uniqueDisciplinas.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Summaries Grid */}
      {filtered.length === 0 ? (
        <div className={`p-12 text-center rounded-3xl border border-dashed space-y-4 ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-300 shadow-sm'
        }`}>
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mx-auto border border-cyan-500/20">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Nenhum resumo encontrado
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-1">
              Participe de uma sessão na Zona de Estudo com o Prof. Pacavira e, ao clicar em "Terminar Aula", seu resumo oficial aparecerá aqui.
            </p>
          </div>
          <button
            onClick={() => onStartStudy()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Iniciar Aula com Prof. Pacavira</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((resumo) => (
            <div
              key={resumo.id}
              className={`border rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all group shadow-sm ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/40'
                  : 'bg-white border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div>
                {/* Meta info */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                    isDark
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {resumo.disciplina}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{resumo.sessionDurationMinutes || 25} min</span>
                  </div>
                </div>

                <h3 className={`font-extrabold text-lg font-['Outfit'] mb-2 line-clamp-2 transition-colors ${
                  isDark ? 'text-white group-hover:text-indigo-300' : 'text-slate-900 group-hover:text-indigo-600'
                }`}>
                  {resumo.tema}
                </h3>

                {/* Key takeaways snippets */}
                {resumo.keyTakeaways && resumo.keyTakeaways.length > 0 && (
                  <div className="space-y-1 mb-4 pt-1">
                    {resumo.keyTakeaways.slice(0, 2).map((takeaway, i) => (
                      <div key={i} className={`flex items-start gap-1.5 text-xs line-clamp-1 ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                        <span>{takeaway}</span>
                      </div>
                    ))}
                  </div>
                )}

                <p className={`text-xs line-clamp-3 leading-relaxed mb-4 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {resumo.content.replace(/[*#_`]/g, '')}
                </p>
              </div>

              {/* Actions Footer */}
              <div className={`pt-3 border-t flex items-center justify-between gap-2 ${
                isDark ? 'border-slate-800/80' : 'border-slate-200'
              }`}>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(resumo.createdAt).toLocaleDateString('pt-BR')}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => deleteResumo(resumo.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Excluir resumo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setReadingResumo(resumo)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Ler Completo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Reading Modal */}
      {readingResumo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className={`w-full max-w-3xl border rounded-3xl p-6 sm:p-8 shadow-2xl my-8 relative max-h-[85vh] flex flex-col transition-colors ${
            isDark ? 'bg-slate-900 border-indigo-500/30' : 'bg-white border-indigo-200'
          }`}>
            {/* Header */}
            <div className={`flex items-start justify-between gap-4 pb-4 border-b shrink-0 ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    isDark
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {readingResumo.disciplina}
                  </span>
                  <span className="text-xs text-slate-400">
                    Nível: {readingResumo.academicLevel}
                  </span>
                </div>
                <h2 className={`text-xl sm:text-2xl font-extrabold font-['Outfit'] ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {readingResumo.tema}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(readingResumo.content)}
                  className={`p-2 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                  title="Copiar texto"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
                <button
                  onClick={() => setReadingResumo(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className={`flex-1 overflow-y-auto py-5 space-y-5 text-sm leading-relaxed pr-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              {readingResumo.keyTakeaways && readingResumo.keyTakeaways.length > 0 && (
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  isDark
                    ? 'bg-indigo-950/40 border-indigo-500/30'
                    : 'bg-indigo-50/70 border-indigo-200'
                }`}>
                  <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    Pontos-chave para Memorização
                  </h4>
                  <div className="space-y-1.5">
                    {readingResumo.keyTakeaways.map((item, i) => (
                      <div key={i} className={`flex items-start gap-2 text-xs ${
                        isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed">
                {readingResumo.content}
              </div>
            </div>

            {/* Footer */}
            <div className={`pt-4 border-t shrink-0 flex items-center justify-between text-xs ${
              isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-500'
            }`}>
              <span>Prof. Pacavira • EduMind.AO</span>
              <button
                onClick={() => setReadingResumo(null)}
                className={`px-4 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                }`}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
