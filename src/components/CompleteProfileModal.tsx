import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  EDUCATION_LEVELS,
  EducationLevel,
} from '../services/userService.ts';
import {
  GraduationCap,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const CompleteProfileModal: React.FC = () => {
  const { currentUser, completeGoogleProfile, loading, error } = useAuth();
  const [name, setName] = useState(currentUser?.displayName || '');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('Médio');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Por favor, confirme seu nome completo.');
      return;
    }

    try {
      setFormError(null);
      await completeGoogleProfile({
        name: name.trim(),
        educationLevel,
      });
    } catch (err: any) {
      setFormError(err.message || 'Erro ao salvar perfil no banco de dados.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
              Bem-vindo à EduMind.AO
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Selecione o seu nível de escolaridade para personalizar suas aulas com o Prof. Pacavira.
            </p>
          </div>
        </div>

        {(formError || error) && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Seu Nome Completo
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Carlos Eduardo Silva"
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          {/* Escolaridade: Primaria, Médio, Superior */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Nível de Escolaridade
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {EDUCATION_LEVELS.map((level) => {
                const isSelected = educationLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setEducationLevel(level)}
                    className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md shadow-indigo-600/20 ring-1 ring-indigo-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                    }`}
                  >
                    <span className="text-sm font-semibold">{level}</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {level === 'Primaria' ? 'Primário' : level === 'Médio' ? 'Médio' : 'Superior'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Salvando dados...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Concluir e Acessar EduMind.AO
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
