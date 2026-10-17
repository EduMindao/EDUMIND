import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onOpenForgotPassword: (email: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToRegister,
  onOpenForgotPassword,
}) => {
  const { loginWithEmail, loginWithGoogle, loading, error, clearError } = useAuth();
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!email.trim()) {
      setLocalError('Por favor, informe seu e-mail.');
      return;
    }
    if (!password) {
      setLocalError('Por favor, digite sua senha.');
      return;
    }

    try {
      await loginWithEmail(email.trim(), password);
    } catch {
      // Error handled by AuthContext
    }
  };

  const handleGoogleLogin = async () => {
    clearError();
    setLocalError(null);
    try {
      await loginWithGoogle();
    } catch {
      // Error handled by AuthContext
    }
  };

  const displayError = localError || error;

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className={`text-2xl sm:text-3xl font-extrabold font-['Outfit'] tracking-tight ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Acesse sua conta
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Continue seus estudos e acerte suas metas na EduMind.
        </p>
      </div>

      {/* Google 1-Click Login Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className={`w-full py-3.5 px-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-3 shadow-sm group cursor-pointer disabled:opacity-50 ${
          isDark
            ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
            : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
        }`}
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
        <span className={isDark ? 'group-hover:text-white transition-colors' : 'group-hover:text-slate-900 transition-colors'}>
          Continuar com o Google
        </span>
      </button>

      <div className="relative my-6 flex items-center justify-center">
        <div className={`border-t w-full ${isDark ? 'border-slate-800' : 'border-slate-200'}`}></div>
        <span className={`px-3 text-xs font-medium tracking-wide uppercase ${
          isDark ? 'bg-[#0b0f19] text-slate-500' : 'bg-white text-slate-400'
        }`}>
          ou com e-mail
        </span>
      </div>

      {displayError && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">{displayError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            E-mail
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none transition-all ${
                isDark
                  ? 'bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500'
                  : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600 shadow-xs'
              }`}
            />
          </div>
        </div>

        {/* Senha */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`block text-xs font-semibold uppercase tracking-wider ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Senha
            </label>
            <button
              type="button"
              onClick={() => onOpenForgotPassword(email)}
              className="text-xs font-medium text-indigo-500 hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Esqueceu a senha?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha de acesso"
              className={`w-full pl-11 pr-11 py-3 rounded-xl text-sm focus:outline-none transition-all ${
                isDark
                  ? 'bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500'
                  : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600 shadow-xs'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Lembrar-me */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500/40"
            />
            <span className="text-xs text-slate-400 select-none">
              Lembrar meus dados neste dispositivo
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
                Validando Acesso...
              </>
            ) : (
              <>
                <span>Entrar na Plataforma</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Switch to Register */}
      <div className={`mt-8 pt-6 border-t text-center ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
        <p className="text-xs sm:text-sm text-slate-400">
          Ainda não tem cadastro na EduMind?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-indigo-500 font-bold hover:text-indigo-400 transition-colors underline-offset-4 hover:underline cursor-pointer ml-1"
          >
            Cadastre-se gratuitamente
          </button>
        </p>
      </div>
    </div>
  );
};
