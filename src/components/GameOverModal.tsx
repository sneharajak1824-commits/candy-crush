import React from 'react';
import { RotateCcw, Trophy, Sparkles, Flame, Heart } from 'lucide-react';
import { GameStats } from '../types';
import { getGarbaRank, JETHALAL_REACTIONS } from '../utils/constants';

interface GameOverModalProps {
  stats: GameStats;
  isNewHighScore: boolean;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  isNewHighScore,
  onRestart,
}) => {
  const rank = getGarbaRank(stats.score);

  // Pick Jethalal's reaction based on score
  let jethaQuote = JETHALAL_REACTIONS.lowScore;
  if (stats.score >= 3500) {
    jethaQuote = JETHALAL_REACTIONS.highScore;
  } else if (stats.score >= 1000) {
    jethaQuote = JETHALAL_REACTIONS.goodScore;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-gradient-to-b from-purple-950 via-slate-900 to-pink-950 border-2 border-amber-500/60 rounded-3xl max-w-sm w-full p-6 text-white text-center shadow-[0_0_40px_rgba(245,158,11,0.35)] relative">
        {/* Festive Icon Banner */}
        <div className="w-16 h-16 mx-auto -mt-12 bg-gradient-to-tr from-amber-500 via-pink-500 to-yellow-300 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-2 border-white/40 animate-bounce">
          🪘
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-pink-300 mt-3 font-serif">
          Garba Mahotsav Complete!
        </h2>
        <p className="text-xs text-amber-200/80 font-medium italic mt-0.5">
          "Hey Maa Mataji! Kya Garba tha!"
        </p>

        {/* New High Score Alert */}
        {isNewHighScore && (
          <div className="my-3 inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-pink-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-md animate-pulse">
            <Sparkles className="w-3.5 h-3.5 fill-yellow-200" />
            NEW GOKULDHAM RECORD!
          </div>
        )}

        {/* Score Display Card */}
        <div className="my-4 bg-slate-800/80 rounded-2xl p-4 border border-amber-500/30">
          <span className="text-xs text-amber-300/80 uppercase font-semibold tracking-wider">
            Total Garba Score
          </span>
          <div className="text-4xl font-black text-amber-300 font-mono tracking-tight my-1">
            {stats.score.toLocaleString()}
          </div>
          <div className="inline-block bg-pink-900/60 border border-pink-400/40 text-pink-200 text-xs font-bold px-3 py-1 rounded-full mt-1">
            🏆 {rank}
          </div>
        </div>

        {/* Detailed Match Statistics */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <div className="bg-slate-800/50 p-2 rounded-xl border border-white/5 flex items-center justify-between">
            <span className="text-slate-400">Dandiyas:</span>
            <span className="font-bold text-amber-300 font-mono">
              {stats.dandiyasCaught}
            </span>
          </div>
          <div className="bg-slate-800/50 p-2 rounded-xl border border-white/5 flex items-center justify-between">
            <span className="text-slate-400">Max Combo:</span>
            <span className="font-bold text-pink-400 font-mono">
              {stats.maxCombo}x
            </span>
          </div>
          <div className="bg-slate-800/50 p-2 rounded-xl border border-white/5 flex items-center justify-between">
            <span className="text-slate-400">Sweets (Goli):</span>
            <span className="font-bold text-emerald-400 font-mono">
              {stats.sweetsCaught}
            </span>
          </div>
          <div className="bg-slate-800/50 p-2 rounded-xl border border-white/5 flex items-center justify-between">
            <span className="text-slate-400">Perfect Beats:</span>
            <span className="font-bold text-yellow-300 font-mono">
              {stats.perfectCatches}
            </span>
          </div>
        </div>

        {/* Jethalal's Reaction speech bubble */}
        <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 mb-5 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">👓</span>
            <span className="text-[11px] font-bold text-amber-300">
              Jethalal ke Bol:
            </span>
          </div>
          <p className="text-xs text-amber-100/90 italic font-serif">
            "{jethaQuote}"
          </p>
        </div>

        {/* Restart Action */}
        <button
          id="btn-play-again"
          onClick={onRestart}
          className="w-full py-3 bg-gradient-to-r from-amber-500 via-pink-600 to-amber-500 hover:opacity-95 font-black text-sm text-white rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Phir Se Garba Khelo! (Play Again)</span>
        </button>
      </div>
    </div>
  );
};
