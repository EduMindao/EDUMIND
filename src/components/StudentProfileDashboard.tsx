import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { BrandLogo } from './BrandLogo.tsx';
import { DashboardOverview } from './DashboardOverview.tsx';
import { ZonaDisciplinas } from './ZonaDisciplinas.tsx';
import { ZonaEstudo } from './ZonaEstudo.tsx';
import { ZonaResumos } from './ZonaResumos.tsx';
import { ZonaTarefas } from './ZonaTarefas.tsx';
import { ZonaPerfil } from './ZonaPerfil.tsx';
import {
  Disciplina,
  Resumo,
  Tarefa,
  subscribeDisciplinas,
  subscribeResumos,
  subscribeTarefas,
} from '../services/studyService.ts';
import {
  LayoutDashboard,
  Brain,
  BookOpen,
  FileText,
  CheckSquare,
  LogOut,
  User,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export type MainNavTab = 'dashboard' | 'estudo' | 'disciplinas' | 'resumos' | 'tarefas' | 'perfil';

export const StudentProfileDashboard: React.FC = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<MainNavTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Study Data States
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [resumos, setResumos] = useState<Resumo[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);

  // Pre-selected for study
  const [preSelectedDisciplina, setPreSelectedDisciplina] = useState<string>('');
  const [preSelectedTema, setPreSelectedTema] = useState<string>('');

  const userId = currentUser?.uid || '';
  const userLevel = userProfile?.educationLevel || 'Médio';
  const studentName = userProfile?.name || currentUser?.displayName || 'Estudante';

  // Real-time subscriptions
  useEffect(() => {
    if (!userId) return;

    const unsubDisc = subscribeDisciplinas(userId, (data) => setDisciplinas(data));
    const unsubRes = subscribeResumos(userId, (data) => setResumos(data));
    const unsubTar = subscribeTarefas(userId, (data) => setTarefas(data));

    return () => {
      unsubDisc();
      unsubRes();
      unsubTar();
    };
  }, [userId]);

  const handleSelectTemaForStudy = (disciplina: string, tema: string) => {
    setPreSelectedDisciplina(disciplina);
    setPreSelectedTema(tema);
    setActiveTab('estudo');
    setMobileMenuOpen(false);
  };

  const navItems: {
    id: MainNavTab;
    label: string;
    description: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'Visão geral & Métricas',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'estudo',
      label: 'Zona de Estudo',
      description: 'Prof. Pacavira & Pomodoro',
      icon: <Brain className="w-5 h-5" />,
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
    },
    {
      id: 'disciplinas',
      label: 'Disciplinas',
      description: 'Matérias & Temas',
      icon: <BookOpen className="w-5 h-5" />,
      badge: disciplinas.length,
    },
    {
      id: 'resumos',
      label: 'Resumos',
      description: 'Anotações inteligentes',
      icon: <FileText className="w-5 h-5" />,
      badge: resumos.length,
    },
    {
      id: 'tarefas',
      label: 'Tarefas',
      description: 'Exercícios & Fixação',
      icon: <CheckSquare className="w-5 h-5" />,
      badge: tarefas.filter((t) => t.status === 'pendente').length,
      badgeColor: 'bg-amber-500/20 text-amber-500 border border-amber-500/30',
    },
    {
      id: 'perfil',
      label: 'Perfil',
      description: 'Modo Claro/Escuro & Dados',
      icon: <User className="w-5 h-5" />,
    },
  ];

  const getTabTitle = (tab: MainNavTab) => {
    switch (tab) {
      case 'dashboard':
        return { title: 'Dashboard', subtitle: 'Acompanhe seu progresso, metas e resumo geral de estudos' };
      case 'estudo':
        return { title: 'Zona de Estudo', subtitle: 'Aula interativa com o Prof. Pacavira IA e cronômetro Pomodoro' };
      case 'disciplinas':
        return { title: 'Disciplinas & Conteúdos', subtitle: 'Gerencie suas matérias escolares e tópicos a dominar' };
      case 'resumos':
        return { title: 'Banco de Resumos', subtitle: 'Resumos gerados automaticamente após cada sessão de aula' };
      case 'tarefas':
        return { title: 'Tarefas & Exercícios', subtitle: 'Exercícios práticos para fixar o conteúdo estudado' };
      case 'perfil':
        return { title: 'Meu Perfil', subtitle: 'Preferências visuais (Modo Claro/Escuro) e dados do estudante' };
      default:
        return { title: 'EduMind.AO', subtitle: 'Plataforma de Estudo e Aprendizagem' };
    }
  };

  const currentTabInfo = getTabTitle(activeTab);

  return (
    <div
      className={`min-h-screen flex selection:bg-indigo-500 selection:text-white transition-colors duration-200 ${
        isDark ? 'bg-[#070a13] text-slate-100' : 'bg-[#f8fafc] text-slate-800'
      }`}
    >
      {/* ============================================================ */}
      {/* DESKTOP LATERAL SIDEBAR (MENU DE LADO) */}
      {/* ============================================================ */}
      <aside
        className={`hidden md:flex flex-col w-64 lg:w-72 shrink-0 border-r sticky top-0 h-screen overflow-y-auto transition-colors z-40 ${
          isDark
            ? 'bg-slate-900/90 border-slate-800/80 shadow-2xl'
            : 'bg-white border-slate-200/90 shadow-sm'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className={`p-5 lg:p-6 border-b transition-colors ${
          isDark ? 'border-slate-800/70' : 'border-slate-100'
        }`}>
          <BrandLogo size="sm" showSubtitle={true} />
        </div>

        {/* Navigation Section */}
        <div className="flex-1 py-5 px-3 lg:px-4 space-y-6 overflow-y-auto">
          <div>
            <div className={`px-3 mb-2.5 text-[10px] font-extrabold uppercase tracking-widest ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Menu Principal
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full group flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : isDark
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {item.icon}
                      </span>
                      <div className="text-left truncate">
                        <div className="truncate">{item.label}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {item.badge !== undefined && item.badge > 0 && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.badgeColor
                              ? item.badgeColor
                              : isDark
                              ? 'bg-slate-800 text-indigo-300 border border-slate-700'
                              : 'bg-slate-200 text-indigo-700 border border-slate-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isActive
                            ? 'text-white translate-x-0.5 opacity-90'
                            : 'opacity-0 group-hover:opacity-60 group-hover:translate-x-0.5'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick AI Teacher Banner */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isDark
              ? 'bg-gradient-to-br from-indigo-950/60 via-slate-900 to-indigo-950/40 border-indigo-500/25 shadow-md'
              : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-indigo-200/80 shadow-xs'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-indigo-500">Prof. Pacavira IA</span>
            </div>
            <p className={`text-[11px] leading-relaxed mb-3 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Aulas inteligentes adaptadas ao seu nível escolar com método Pomodoro.
            </p>
            <button
              onClick={() => setActiveTab('estudo')}
              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Iniciar Aula</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sidebar Footer: Theme Toggle & User Info */}
        <div className={`p-3.5 lg:p-4 border-t space-y-2.5 transition-colors ${
          isDark ? 'border-slate-800/80 bg-slate-900/60' : 'border-slate-100 bg-slate-50/50'
        }`}>
          {/* Quick Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
            }`}
            title="Alternar entre Modo Claro e Escuro"
          >
            <div className="flex items-center gap-2">
              {isDark ? (
                <Moon className="w-4 h-4 text-indigo-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span>{isDark ? 'Modo Escuro' : 'Modo Claro'}</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              isDark
                ? 'bg-indigo-500/20 text-indigo-300'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {isDark ? 'Dark' : 'Light'}
            </span>
          </button>

          {/* User Profile Pill */}
          <div
            onClick={() => setActiveTab('perfil')}
            className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
              activeTab === 'perfil'
                ? 'border-indigo-500 bg-indigo-500/10'
                : isDark
                ? 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/70'
                : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white text-xs font-extrabold shadow-sm shrink-0">
                {studentName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 text-left">
                <div className={`text-xs font-bold truncate ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {studentName}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {userLevel}
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                logout();
              }}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? 'border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30'
                  : 'border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200'
              }`}
              title="Sair da Conta"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* MOBILE DRAWER / OVERLAY SIDEBAR */}
      {/* ============================================================ */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />

          {/* Drawer Container */}
          <div
            className={`relative w-72 max-w-[85vw] h-full flex flex-col z-10 shadow-2xl transition-transform ${
              isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'
            }`}
          >
            {/* Drawer Header */}
            <div className={`p-4 border-b flex items-center justify-between ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <BrandLogo size="sm" showSubtitle={false} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2 rounded-xl border ${
                  isDark
                    ? 'border-slate-800 text-slate-400 hover:text-white bg-slate-800/60'
                    : 'border-slate-200 text-slate-600 hover:text-slate-900 bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Menu Principal
              </div>

              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : isDark
                        ? 'text-slate-300 hover:bg-slate-800'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : isDark
                          ? 'bg-slate-800 text-indigo-300'
                          : 'bg-slate-200 text-indigo-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Drawer Footer */}
            <div className={`p-4 border-t space-y-2 ${
              isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'
            }`}>
              <button
                onClick={toggleTheme}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-semibold ${
                  isDark
                    ? 'bg-slate-800 text-slate-200 border-slate-700'
                    : 'bg-white text-slate-700 border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isDark ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  <span>{isDark ? 'Modo Escuro Ativo' : 'Modo Claro Ativo'}</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-indigo-500">Mudar</span>
              </button>

              <button
                onClick={() => logout()}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold ${
                  isDark
                    ? 'border-slate-800 text-rose-400 hover:bg-rose-500/10'
                    : 'border-slate-200 text-rose-600 hover:bg-rose-50'
                }`}
              >
                <LogOut className="w-4 h-4" />
                <span>Sair da Conta</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MAIN CONTENT AREA */}
      {/* ============================================================ */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Header Bar for Desktop & Mobile */}
        <header
          className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors ${
            isDark
              ? 'border-slate-800/80 bg-slate-950/70'
              : 'border-slate-200/80 bg-white/70 shadow-xs'
          }`}
        >
          <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
            {/* Mobile Header Left: Hamburger & Brand */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-xs'
                }`}
                aria-label="Abrir menu de lado"
              >
                <Menu className="w-5 h-5" />
              </button>
              <BrandLogo size="sm" showSubtitle={false} />
            </div>

            {/* Desktop Header Left: Current Screen Title & Subtitle */}
            <div className="hidden md:block">
              <div className="flex items-center gap-2.5">
                <h1 className={`text-lg lg:text-xl font-bold font-['Outfit'] ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {currentTabInfo.title}
                </h1>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                  isDark
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                }`}>
                  {userLevel}
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {currentTabInfo.subtitle}
              </p>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2.5">
              {/* Quick Theme Switcher */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                  isDark
                    ? 'bg-slate-900 hover:bg-slate-800 text-amber-400 border-slate-800'
                    : 'bg-white hover:bg-slate-100 text-amber-600 border-slate-200 shadow-xs'
                }`}
                title={isDark ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Direct Profile Button */}
              <button
                onClick={() => setActiveTab('perfil')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  activeTab === 'perfil'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                    : isDark
                    ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-xs'
                }`}
                title="Acessar Perfil"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {studentName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{studentName.split(' ')[0]}</span>
              </button>

              {/* Logout button (desktop) */}
              <button
                onClick={() => logout()}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-slate-900 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-300 border-slate-800 text-slate-400'
                    : 'bg-white hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 border-slate-200 text-slate-600 shadow-xs'
                }`}
                title="Sair da Plataforma"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              userProfile={userProfile}
              currentUserDisplayName={currentUser?.displayName}
              disciplinas={disciplinas}
              resumos={resumos}
              tarefas={tarefas}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectTemaForStudy={handleSelectTemaForStudy}
            />
          )}

          {activeTab === 'estudo' && (
            <ZonaEstudo
              userId={userId}
              userLevel={userLevel}
              disciplinas={disciplinas}
              initialDisciplina={preSelectedDisciplina}
              initialTema={preSelectedTema}
              onNavigateToResumos={() => setActiveTab('resumos')}
              onNavigateToTarefas={() => setActiveTab('tarefas')}
            />
          )}

          {activeTab === 'disciplinas' && (
            <ZonaDisciplinas
              disciplinas={disciplinas}
              userId={userId}
              onSelectTemaForStudy={handleSelectTemaForStudy}
            />
          )}

          {activeTab === 'resumos' && (
            <ZonaResumos
              resumos={resumos}
              onStartStudy={(disc, tema) => {
                if (disc) setPreSelectedDisciplina(disc);
                if (tema) setPreSelectedTema(tema);
                setActiveTab('estudo');
              }}
            />
          )}

          {activeTab === 'tarefas' && (
            <ZonaTarefas
              tarefas={tarefas}
              onStartStudy={(disc, tema) => {
                if (disc) setPreSelectedDisciplina(disc);
                if (tema) setPreSelectedTema(tema);
                setActiveTab('estudo');
              }}
            />
          )}

          {activeTab === 'perfil' && (
            <ZonaPerfil
              userProfile={userProfile}
              disciplinas={disciplinas}
              resumos={resumos}
              tarefas={tarefas}
            />
          )}
        </main>

        {/* Footer */}
        <footer
          className={`border-t px-4 sm:px-6 lg:px-8 py-4 text-center text-xs transition-colors mt-auto ${
            isDark
              ? 'border-slate-800/60 bg-slate-950/40 text-slate-500'
              : 'border-slate-200 bg-white text-slate-500'
          }`}
        >
          <p>
            &copy; {new Date().getFullYear()} EduMind.AO — Plataforma de Estudo e Aprendizagem. Professor Inteligente Prof. Pacavira.
          </p>
        </footer>
      </div>
    </div>
  );
};

