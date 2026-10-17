import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import {
  EDUCATION_LEVELS,
  EducationLevel,
} from '../services/userService.ts';
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { registerWithEmail, loginWithGoogle, loading, error, clearError } = useAuth();
  const { isDark } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('Médio');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Sem senha', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^a-zA-Z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Fraca', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, label: 'Razoável', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Boa', color: 'bg-blue-500' };
    return { score: 4, label: 'Forte', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!name.trim() || name.trim().length < 2) {
      setLocalError('Informe seu nome completo (mínimo 2 caracteres).');
      return;
    }
    if (!email.trim()) {
      setLocalError('Informe um e-mail válido.');
      return;
    }
    if (password.length < 6) {
      setLocalError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('As senhas não coincidem. Digite a mesma senha nos dois campos.');
      return;
    }
    if (!termsAccepted) {
      setLocalError('Você precisa concordar com os Termos de Uso da EduMind.AO.');
      return;
    }

    try {
      await registerWithEmail({
        name: name.trim(),
        email: email.trim(),
        pass: password,
        educationLevel,
      });
    } catch {
      // Handled in AuthContext
    }
  };

  const handleGoogleSignup = async () => {
    clearError();
    setLocalError(null);
    try {
      await loginWithGoogle();
    } catch {
      // Handled in AuthContext
    }
  };

  const displayError = localError || error;

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
          Crie sua conta de estudos
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Junte-se à EduMind.AO e melhore seu desempenho académico.
        </p>
      </div>

      {/* Google 1-Click Signup Button */}
      <button
        type="button"
        onClick={handleGoogleSignup}
        disabled={loading}
        className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700/80 hover:border-slate-600 text-slate-200 text-sm font-semibold transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-indigo-500/5 group cursor-pointer disabled:opacity-50"
      >
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
        <span className="group-hover:text-white transition-colors">
          Cadastrar com o Google
        </span>
      </button>

      <div className="relative my-6 flex items-center justify-center">
        <div className="border-t border-slate-800 w-full"></div>
        <span className="bg-[#0b0f19] px-3 text-xs text-slate-500 font-medium tracking-wide uppercase">
          ou preencha os dados
        </span>
      </div>

      {displayError && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">{displayError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome Completo */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Nome Completo
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <UserIcon className="w-5 h-5" />
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Beatriz Silva"
              className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        {/* E-mail */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            E-mail
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        {/* Escolaridade: Primaria, Médio, Superior */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Escolaridade
            </label>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              Nível Académico
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {EDUCATION_LEVELS.map((level) => {
              const isSelected = educationLevel === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setEducationLevel(level)}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md shadow-indigo-600/20 ring-1 ring-indigo-500'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <span className="text-sm font-semibold">{level}</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {level === 'Primaria' ? 'Ensino Primário' : level === 'Médio' ? 'Ensino Médio' : 'Ensino Superior'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Senha */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Crie uma Senha
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full pl-11 pr-11 py-3 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Medidor visual de força */}
          {password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden flex gap-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-full flex-1 transition-all duration-300 rounded-full ${
                      step <= strength.score ? strength.color : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] font-medium text-slate-400">
                {strength.label}
              </span>
            </div>
          )}
        </div>

        {/* Confirmar Senha */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Confirmar Senha
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita sua senha"
              className={`w-full pl-11 pr-11 py-3 bg-slate-900/80 border rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none transition-all ${
                confirmPassword && confirmPassword === password
                  ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : confirmPassword && confirmPassword !== password
                  ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
              }`}
            />
            {confirmPassword && confirmPassword === password && (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
          </div>
        </div>

        {/* Termos de Uso */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/40 focus:ring-offset-0"
            />
            <span className="text-xs text-slate-400 leading-snug select-none">
              Concordo com os Termos da <strong>EduMind.AO</strong> para estudo inteligente e acompanhamento de resultados.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Cadastrando na EduMind.AO...
              </>
            ) : (
              <>
                <span>Cadastrar na EduMind.AO</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Switch to Login */}
      <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
        <p className="text-xs sm:text-sm text-slate-400">
          Já possui cadastro na EduMind.AO?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors underline-offset-4 hover:underline cursor-pointer ml-1"
          >
            Fazer Login
          </button>
        </p>
      </div>
    </div>
  );
};
