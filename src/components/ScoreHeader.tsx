import React from 'react';
import { Volume2, VolumeX, Flame, Pause, Play, HelpCircle } from 'lucide-react';
import { GameStats } from '../types';

interface ScoreHeaderProps {
  stats: GameStats;
  isMuted: boolean;
  isPaused: boolean;
  onToggleMute: () => void;
  onTogglePause: () => void;
  onOpenInstructions: () => void;
  onTriggerHeyMaaMataji: () => void;
}

export const ScoreHeader: React.FC<ScoreHeaderProps> = ({
  stats,
  isMuted,
  isPaused,
  onToggleMute,
  onTogglePause,
  onOpenInstructions,
  onTriggerHeyMaaMataji,
}) => {
  return (
    <header className="w-full bg-gradient-to-r from-purple-950 via-slate-900 to-pink-950 border-b border-amber-500/30 px-3 py-2 text-white select-none">
      {/* Top Bar: Title, Controls, Lives */}
      <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-amber-500/20 border border-amber-400/40 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <span className="text-amber-300 font-bold text-xs uppercase tracking-wider">
              {stats.isFrenzy ? '⚡ FRENZY' : `Round ${stats.level}`}
            </span>
            <span className="text-pink-300 text-xs">({stats.currentBpm} BPM)</span>
          </div>

          {/* Quick Daya Voice Motif button */}
          <button
            id="btn-daya-dialogue"
            onClick={onTriggerHeyMaaMataji}
            title="Daya: Hey Maa Mataji!"
            className="text-xs bg-pink-600/80 hover:bg-pink-500 border border-pink-300/40 text-amber-100 font-bold px-2 py-0.5 rounded-full transition-all active:scale-95 shadow-sm"
          >
            🙏 Hey Maa!
          </button>
        </div>

        {/* 3 Traditional Glowing Diya Lives */}
        <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full border border-amber-500/30">
          <span className="text-[11px] text-amber-200/80 font-medium mr-1">Diyas:</span>
          {[0, 1, 2].map((idx) => {
            const hasLife = idx < stats.diyas;
            return (
              <div
                key={idx}
                className={`relative w-4 h-4 rounded-full transition-all duration-300 ${
                  hasLife
                    ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                    : 'bg-stone-700/50 opacity-40'
                }`}
                title={hasLife ? 'Active Diya (Life)' : 'Extinguished Diya'}
              >
                {hasLife && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
            );
          })}
        </div>

        {/* Actions (Instructions, Sound, Pause) */}
        <div className="flex items-center gap-1">
          <button
            id="btn-instructions"
            onClick={onOpenInstructions}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-500/20 transition-colors"
            title="How to Play"
            aria-label="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            id="btn-mute-toggle"
            onClick={onToggleMute}
            className={`p-1.5 rounded-lg border transition-colors ${
              isMuted
                ? 'bg-red-950/70 border-red-500/40 text-red-300'
                : 'bg-slate-800/80 border-amber-500/20 text-amber-300 hover:bg-slate-700'
            }`}
            title={isMuted ? 'Unmute Garba Dhol' : 'Mute Sound'}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            id="btn-pause-toggle"
            onClick={onTogglePause}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-500/20 transition-colors"
            title={isPaused ? 'Resume Game' : 'Pause Game'}
            aria-label="Toggle Pause"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Middle Bar: Score, Multiplier, Combo */}
      <div className="flex items-center justify-between gap-4 max-w-lg mx-auto mt-1.5 pt-1 border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-[10px] text-amber-300/80 font-semibold tracking-wider uppercase">
            Garba Score
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-300 font-mono tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {stats.score.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              (Best: {stats.highScore.toLocaleString()})
            </span>
          </div>
        </div>

        {/* Combo Badge */}
        <div className="flex items-center gap-2">
          {stats.combo > 1 && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-pink-600 to-amber-500 px-2.5 py-0.5 rounded-full border border-amber-200/50 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-bounce">
              <Flame className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200" />
              <span className="text-xs font-black text-white">
                {stats.combo}x COMBO!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Frenzy Meter Bar */}
      <div className="max-w-lg mx-auto mt-1.5">
        <div className="flex items-center justify-between text-[10px] font-bold text-amber-200/90 mb-0.5">
          <span className="flex items-center gap-1">
            <span className="text-xs">✨</span> Super Garba Frenzy
          </span>
          <span>
            {stats.isFrenzy
              ? `${Math.ceil(stats.frenzyTimeRemaining)}s ACTIVE (2X POINTS!)`
              : `${Math.floor(stats.frenzyMeter)}%`}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-800/90 rounded-full overflow-hidden border border-amber-500/30 relative">
          <div
            className={`h-full transition-all duration-200 ${
              stats.isFrenzy
                ? 'bg-gradient-to-r from-amber-400 via-pink-400 to-yellow-300 animate-pulse'
                : 'bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400'
            }`}
            style={{
              width: stats.isFrenzy
                ? `${(stats.frenzyTimeRemaining / 10) * 100}%`
                : `${stats.frenzyMeter}%`,
            }}
          />
        </div>
      </div>
    </header>
  );
};
