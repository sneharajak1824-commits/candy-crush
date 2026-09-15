export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';

export type ItemType = 
  | 'DANDIYA_RED'       // Standard Dandiya (100 pts)
  | 'DANDIYA_GOLD'      // Golden Sparkle Dandiya (250 pts + frenzy)
  | 'DANDIYA_DUAL'      // Paired Dandiyas (200 pts)
  | 'JALEBI_FAFDA'      // Goli's special snack (Restore 1 Diya or +500 pts)
  | 'MODAK_SWEET'       // Festive sweet (+300 pts)
  | 'BHIDE_WHISTLE'     // Obstacle! Bhide's whistle (lose 1 Diya / pause)
  | 'CRICKET_BALL';     // Obstacle! Tapu Sena's stray tennis ball

export type ThrowerName = 'Tapu' | 'Goli' | 'Sonu' | 'Gogi' | 'Pinku';

export interface FallingItem {
  id: string;
  type: ItemType;
  lane: number;          // 0 to 4 (5 lanes)
  x: number;             // center X on canvas
  y: number;             // current Y
  speed: number;
  rotation: number;
  rotSpeed: number;
  thrower: ThrowerName;
  caught: boolean;
  missed: boolean;
  points: number;
  isObstacle: boolean;
  scale: number;
}

export interface TapuSenaMember {
  name: ThrowerName;
  lane: number;
  color: string;
  accessory: string;
  animTimer: number;
  quote: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'star' | 'petal' | 'spark' | 'sparkle';
  rotation?: number;
  vRot?: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  vy: number;
  color: string;
  alpha: number;
  life: number;
  scale: number;
  isSpecial?: boolean;
}

export interface DayaCharacter {
  lane: number;         // target lane 0-4
  x: number;            // current smooth X
  targetX: number;
  y: number;            // bottom position
  width: number;
  height: number;
  isCatching: boolean;
  catchTimer: number;
  isSpinning: boolean;
  spinAngle: number;
  dialogue: string | null;
  dialogueTimer: number;
  dandiyaAngleLeft: number;
  dandiyaAngleRight: number;
}

export interface GameStats {
  score: number;
  highScore: number;
  combo: number;
  maxCombo: number;
  diyas: number;        // lives (max 3)
  frenzyMeter: number;  // 0 to 100
  isFrenzy: boolean;
  frenzyTimeRemaining: number;
  dandiyasCaught: number;
  sweetsCaught: number;
  obstaclesDodged: number;
  perfectCatches: number;
  level: number;
  currentBpm: number;
}

export interface RhythmHitResult {
  timing: 'PERFECT' | 'GREAT' | 'GOOD' | 'MISS';
  multiplier: number;
  label: string;
}
