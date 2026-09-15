import React from 'react';
import { X, Trophy, ShieldAlert, Sparkles } from 'lucide-react';
import { TAPU_SENA } from '../utils/constants';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 border-2 border-amber-500/50 rounded-2xl max-w-md w-full p-5 text-white shadow-[0_0_30px_rgba(245,158,11,0.25)] relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
          aria-label="Close instructions"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <span className="inline-block text-2xl mb-1">🪘✨</span>
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-yellow-200 tracking-wide font-serif">
            Daya's Garba Dash
          </h2>
          <p className="text-xs text-amber-200/80 font-medium">
            Tapu Sena Dandiya Rhythm Challenge in Gokuldham!
          </p>
        </div>

        {/* Controls Section */}
        <div className="bg-slate-800/60 rounded-xl p-3 mb-3 border border-amber-500/20">
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span className="text-sm">🎮</span> How To Play & Controls
          </h3>
          <ul className="text-xs text-slate-300 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30">
                Left / Right
              </span>
              <span>Arrow keys or <b>A / D</b> to move Daya between the 5 lanes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30">
                1 - 5
              </span>
              <span>Number keys 1 to 5 to jump straight to any lane!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30">
                Touch / Drag
              </span>
              <span>Swipe horizontally on mobile or tap directly on any lane target!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-pink-400 bg-pink-400/10 px-1.5 py-0.5 rounded border border-pink-400/30">
                Spacebar
              </span>
              <span>"Ae Halo!" Taali (Clap / Catch boost) when dandiya reaches the line!</span>
            </li>
          </ul>
        </div>

        {/* Item Guide */}
        <div className="bg-slate-800/60 rounded-xl p-3 mb-3 border border-amber-500/20">
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> What Tapu Sena Throws
          </h3>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-black/30 p-2 rounded-lg border border-amber-400/20">
              <span className="text-base">🥢</span>
              <p className="font-bold text-amber-300">Dandiya Sticks</p>
              <p className="text-slate-400 text-[10px]">
                Catch on rhythm line for 100 - 200 pts & combos!
              </p>
            </div>
            <div className="bg-black/30 p-2 rounded-lg border border-amber-400/20">
              <span className="text-base">✨</span>
              <p className="font-bold text-yellow-300">Golden Dandiya</p>
              <p className="text-slate-400 text-[10px]">
                +300 pts & charges Super Garba Frenzy meter!
              </p>
            </div>
            <div className="bg-black/30 p-2 rounded-lg border border-green-400/20">
              <span className="text-base">🧇</span>
              <p className="font-bold text-orange-300">Jalebi & Fafda</p>
              <p className="text-slate-400 text-[10px]">
                Goli's special! Restores 1 Diya (life) or +500 pts!
              </p>
            </div>
            <div className="bg-black/30 p-2 rounded-lg border border-red-400/20">
              <span className="text-base">🪈</span>
              <p className="font-bold text-red-400">Bhide's Whistle!</p>
              <p className="text-slate-400 text-[10px]">
                Dodge this obstacle! Hitting costs 1 Diya!
              </p>
            </div>
          </div>
        </div>

        {/* Tapu Sena Team */}
        <div className="bg-slate-800/60 rounded-xl p-3 mb-4 border border-amber-500/20">
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" /> Tapu Sena Lanes
          </h3>
          <div className="flex justify-between items-center text-center">
            {TAPU_SENA.map((member) => (
              <div key={member.name} className="flex flex-col items-center">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow"
                  style={{ backgroundColor: member.color, color: '#ffffff' }}
                >
                  {member.name[0]}
                </span>
                <span className="text-[10px] font-semibold text-slate-300 mt-1">
                  {member.name}
                </span>
                <span className="text-[9px] text-slate-500">Lane {member.lane + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-pink-600 to-amber-500 hover:opacity-90 font-black text-sm text-white rounded-xl shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2"
        >
          <span>Haalo Re Haalo! (Start Playing)</span>
        </button>
      </div>
    </div>
  );
};
