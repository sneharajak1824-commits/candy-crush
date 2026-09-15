import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { TAPU_SENA } from '../utils/constants';

interface MobileControlsProps {
  currentLane: number;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onSelectLane: (lane: number) => void;
  onClap: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  currentLane,
  onMoveLeft,
  onMoveRight,
  onSelectLane,
  onClap,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950/90 border-t border-amber-500/30 p-2.5 flex flex-col gap-2 select-none">
      {/* 5-Lane Quick Switcher with Tapu Sena Badges */}
      <div className="grid grid-cols-5 gap-1.5">
        {TAPU_SENA.map((member) => {
          const isActive = currentLane === member.lane;
          return (
            <button
              key={member.name}
              onClick={() => onSelectLane(member.lane)}
              className={`py-1.5 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center border ${
                isActive
                  ? 'bg-gradient-to-t from-pink-600 to-amber-500 text-white border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)] scale-102'
                  : 'bg-slate-800/80 text-slate-300 border-white/10 hover:bg-slate-700 active:scale-95'
              }`}
              title={`Move to Lane ${member.lane + 1} (${member.name})`}
            >
              <span className="text-[11px] font-black">{member.name}</span>
              <span className="text-[9px] opacity-70">L{member.lane + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Main Steering Buttons & Taali / Catch Button */}
      <div className="flex items-center justify-between gap-2 mt-0.5">
        <button
          id="btn-move-left"
          onClick={onMoveLeft}
          className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 active:bg-amber-600 active:scale-95 text-amber-300 rounded-xl border border-amber-500/30 flex items-center justify-center gap-1.5 font-black text-sm shadow transition-all"
          aria-label="Move Left"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>LEFT</span>
        </button>

        <button
          id="btn-clap-strike"
          onClick={onClap}
          className="flex-1 py-3 bg-gradient-to-r from-amber-500 via-pink-600 to-amber-500 hover:opacity-95 active:scale-95 text-white rounded-xl border border-amber-300/40 flex items-center justify-center gap-1 font-black text-sm shadow-[0_0_12px_rgba(245,158,11,0.4)] transition-all"
          aria-label="Garba Taali Catch"
        >
          <span>👏 TAALI!</span>
        </button>

        <button
          id="btn-move-right"
          onClick={onMoveRight}
          className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 active:bg-amber-600 active:scale-95 text-amber-300 rounded-xl border border-amber-500/30 flex items-center justify-center gap-1.5 font-black text-sm shadow transition-all"
          aria-label="Move Right"
        >
          <span>RIGHT</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
