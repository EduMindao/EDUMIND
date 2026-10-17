import React from 'react';
import { GraduationCap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const { isDark } = useTheme();

  const iconSizes = {
    sm: 'w-7 h-7 text-indigo-100',
    md: 'w-9 h-9 text-indigo-100',
    lg: 'w-12 h-12 text-indigo-100',
  };

  const titleSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl sm:text-4xl',
  };

  return (
    <div className="flex items-center gap-3 select-none">
      <div className="relative flex items-center justify-center p-2.5 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 shadow-lg shadow-indigo-600/25 border border-indigo-400/30 shrink-0">
        <GraduationCap className={iconSizes[size]} />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400"></span>
        </span>
      </div>

      <div>
        <div className="flex items-center gap-1.5">
          <span
            className={`font-extrabold tracking-tight font-['Outfit'] transition-colors ${
              titleSizes[size]
            } ${isDark ? 'text-white' : 'text-slate-900'}`}
          >
            Edu
            <span
              className={`text-transparent bg-clip-text font-black transition-colors ${
                isDark
                  ? 'bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-200'
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800'
              }`}
            >
              Mind
            </span>
            <span
              className={`text-[11px] ml-1.5 font-extrabold px-1.5 py-0.5 rounded-md align-middle transition-colors ${
                isDark
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-2xs'
              }`}
            >
              .AO
            </span>
          </span>
        </div>
        {showSubtitle && (
          <p
            className={`text-xs font-medium tracking-wide transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Plataforma de Estudos & Aprendizado
          </p>
        )}
      </div>
    </div>
  );
};

