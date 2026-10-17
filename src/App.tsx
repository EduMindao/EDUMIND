import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ThemeProvider, useTheme } from './context/ThemeContext.tsx';
import { BrandLogo } from './components/BrandLogo.tsx';
import { LoginForm } from './components/LoginForm.tsx';
import { RegisterForm } from './components/RegisterForm.tsx';
import { StudentProfileDashboard } from './components/StudentProfileDashboard.tsx';
import { CompleteProfileModal } from './components/CompleteProfileModal.tsx';
import { ForgotPasswordModal } from './components/ForgotPasswordModal.tsx';
import {
  GraduationCap,
  BookOpen,
  Award,
  Sparkles,
  CheckCircle2,
  Users,
  ShieldCheck,
  Star,
  Loader2,
  Sun,
  Moon,
} from 'lucide-react';

function EduMindAuthApp() {
  const { currentUser, userProfile, isAuthReady, needsProfileCompletion } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  // Initial loading state while Firebase Auth checks current session
  if (!isAuthReady) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors ${
          isDark ? 'bg-[#070a13]' : 'bg-[#f8fafc]'
        }`}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex items-center justify-center p-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/30">
            <GraduationCap className="w-10 h-10 text-indigo-400 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h2 className={`text-xl font-bold font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>
              EduMind.AO
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-2 justify-center">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
              Carregando plataforma de estudos...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated and has finished onboarding profile
  if (currentUser && !needsProfileCompletion && userProfile) {
    return <StudentProfileDashboard />;
  }

  return (
    <div
      className={`min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white transition-colors duration-200 ${
        isDark ? 'bg-[#070a13] text-slate-100' : 'bg-[#f8fafc] text-slate-800'
      }`}
    >
      {/* Top Navbar */}
      <header
        className={`border-b px-4 sm:px-8 py-4 transition-colors ${
          isDark ? 'border-slate-800/80 bg-slate-900/40 backdrop-blur-md' : 'border-slate-200 bg-white/80 backdrop-blur-md shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <BrandLogo size="md" />

          {/* Quick theme toggle & tab switcher in topbar */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center justify-center ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-200 text-amber-600 hover:bg-slate-200 shadow-xs'
              }`}
              title={isDark ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div
              className={`flex items-center gap-1.5 p-1 rounded-xl border ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <button
                onClick={() => setActiveTab('login')}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Hero Column: Platform Showcase (Educational Value) */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Plataforma de Estudos & Aprendizado</span>
            </div>

            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] font-['Outfit'] ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Transforme seu foco em{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-400">
                resultados
              </span>
              .
            </h1>

            <p className={`text-base leading-relaxed max-w-xl ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              A <strong>EduMind.AO</strong> é uma plataforma de estudo e aprendizagem criada para te ajudar a aprender de forma mais inteligente, melhorar o teu desempenho académico e alcançar melhores resultados.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0 mt-0.5">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Aulas com Prof. Pacavira
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Professor inteligente com Técnica Pomodoro, resumos didáticos e tarefas práticas.
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500 shrink-0 mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Disciplinas & Temas
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Organização curricular adaptada para Ensino Primário, Médio e Superior.
                  </p>
                </div>
              </div>
            </div>

            {/* Student Review & Social Proof */}
            <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-indigo-500 bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                    BA
                  </div>
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-cyan-500 bg-cyan-600 flex items-center justify-center text-xs font-bold text-white">
                    ML
                  </div>
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-purple-500 bg-purple-600 flex items-center justify-center text-xs font-bold text-white">
                    RD
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className={`font-bold ml-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>4.9 / 5</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Estudantes alcançando melhores resultados
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>EduMind.AO Ativo</span>
              </div>
            </div>
          </div>

          {/* Right Column: Auth Container (Login & Register Cards) */}
          <div className="lg:col-span-6 xl:col-span-5">
            <div className={`relative border rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-colors ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {/* Tab Selector Inside Card */}
              <div className={`flex p-1 rounded-2xl border mb-6 ${
                isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : isDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Entrar (Login)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'register'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : isDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Cadastrar (Novo Aluno)
                </button>
              </div>

              {/* Form Content */}
              {activeTab === 'login' ? (
                <LoginForm
                  onSwitchToRegister={() => setActiveTab('register')}
                  onOpenForgotPassword={(email) => {
                    setForgotPasswordEmail(email);
                    setForgotPasswordOpen(true);
                  }}
                />
              ) : (
                <RegisterForm onSwitchToLogin={() => setActiveTab('login')} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t px-4 sm:px-8 py-4 text-center text-xs transition-colors ${
        isDark ? 'border-slate-800/60 bg-slate-950/40 text-slate-500' : 'border-slate-200 bg-white text-slate-500'
      }`}>
        <p>
          &copy; {new Date().getFullYear()} EduMind.AO — Plataforma de Estudo e Aprendizagem. Todos os direitos reservados.
        </p>
      </footer>

      {/* Modals */}
      {needsProfileCompletion && <CompleteProfileModal />}
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        initialEmail={forgotPasswordEmail}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EduMindAuthApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
