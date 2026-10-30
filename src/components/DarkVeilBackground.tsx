import React from 'react';

interface Props {
  darkMode: boolean;
}

export const DarkVeilBackground: React.FC<Props> = ({ darkMode }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic gradient orbs / veil */}
      <div
        className={`absolute -top-40 -left-40 w-96 md:w-[600px] h-96 md:h-[600px] rounded-full blur-[120px] transition-colors duration-700 ${
          darkMode
            ? 'bg-emerald-600/15'
            : 'bg-emerald-400/20'
        }`}
      />
      <div
        className={`absolute top-1/3 -right-40 w-96 md:w-[500px] h-96 md:h-[500px] rounded-full blur-[140px] transition-colors duration-700 ${
          darkMode
            ? 'bg-cyan-600/15'
            : 'bg-cyan-300/25'
        }`}
      />
      <div
        className={`absolute -bottom-40 left-1/3 w-96 md:w-[700px] h-96 md:h-[700px] rounded-full blur-[160px] transition-colors duration-700 ${
          darkMode
            ? 'bg-blue-700/10'
            : 'bg-blue-400/15'
        }`}
      />

      {/* Subtle grid pattern overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          darkMode
            ? 'opacity-[0.035] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]'
            : 'opacity-[0.04] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]'
        }`}
      />

      {/* Floating subtle ambient particles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-pulse transition-opacity duration-700 ${
              darkMode ? 'bg-emerald-400/20' : 'bg-emerald-500/15'
            }`}
            style={{
              width: `${(i % 3) * 3 + 2}px`,
              height: `${(i % 3) * 3 + 2}px`,
              top: `${15 + i * 14}%`,
              left: `${10 + (i * 17) % 80}%`,
              animationDuration: `${3 + i * 1.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
