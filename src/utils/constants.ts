import { TapuSenaMember } from '../types';

export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 720;
export const NUM_LANES = 5;

// Lane center coordinates
export const LANE_WIDTH = CANVAS_WIDTH / NUM_LANES; // 96px per lane
export const getLaneX = (lane: number): number => {
  return lane * LANE_WIDTH + LANE_WIDTH / 2;
};

// Catch line Y-coordinate
export const CATCH_ZONE_Y = CANVAS_HEIGHT - 120;
export const CATCH_TOLERANCE = 45; // pixel tolerance for catching

// Tapu Sena Members along the 5 lanes
export const TAPU_SENA: TapuSenaMember[] = [
  {
    name: 'Tapu',
    lane: 0,
    color: '#f97316', // Orange
    accessory: 'Leader Kurta',
    animTimer: 0,
    quote: 'Mummy, ye lo super dandiya!',
  },
  {
    name: 'Goli',
    lane: 1,
    color: '#06b6d4', // Cyan
    accessory: 'Jalebi Plate',
    animTimer: 0,
    quote: 'Daya aunty, Jalebi-Fafda khao!',
  },
  {
    name: 'Sonu',
    lane: 2,
    color: '#ec4899', // Pink
    accessory: 'Glitter Dandiya',
    animTimer: 0,
    quote: 'Aunty, ekdum perfect catch!',
  },
  {
    name: 'Gogi',
    lane: 3,
    color: '#eab308', // Yellow
    accessory: 'Dholak Sticks',
    animTimer: 0,
    quote: 'Chak de phatte Garba!',
  },
  {
    name: 'Pinku',
    lane: 4,
    color: '#8b5cf6', // Purple
    accessory: 'High Toss Glasses',
    animTimer: 0,
    quote: 'Right side se dandiya incoming!',
  },
];

// Daya Ben's iconic dialogue audio/text lines
export const DAYA_DIALOGUES = [
  'Hey Maa Mataji!',
  'Ae Halo Halo!',
  'Tapu ke Papa dekho!',
  'Gokuldham Garba Queen!',
  'Goli beta masti nahi!',
  'Aha ha ha!',
  'Dandiya King Tapu!',
  'Haalo re Haalo!',
  'Kem Cho Gokuldham!',
  'Non-Stop Garba Express!',
];

export const JETHALAL_REACTIONS = {
  highScore: 'Daya! Kamaal kar diya! Babita ji bhi taaliya baja rahi hain!',
  goodScore: 'Wah Daya wah! Garba ho toh Daya Bhabhi jaisa!',
  lowScore: 'Arre Daya, tapu ke papa ko dukhi mat karo, thoda aur practice karo!',
  frenzy: 'Hey Bhagwan! Daya ka nonstop cyclone Garba shuru ho gaya!',
  bhideObstacle: 'Arre Bhide! Beech Garba me scooter ka horn kyun baja rahe ho?!',
};

export const GARBA_RANKS = [
  { minScore: 0, title: 'Society Beginner (Garba Learner)' },
  { minScore: 500, title: 'Navratri Enthusiast' },
  { minScore: 1500, title: 'Gokuldham Dandiya Star' },
  { minScore: 3500, title: 'Ahmedabad Garba Champion' },
  { minScore: 6000, title: 'Super Garba Queen' },
  { minScore: 10000, title: 'Hey Maa Mataji Legend!' },
];

export const getGarbaRank = (score: number): string => {
  for (let i = GARBA_RANKS.length - 1; i >= 0; i--) {
    if (score >= GARBA_RANKS[i].minScore) {
      return GARBA_RANKS[i].title;
    }
  }
  return GARBA_RANKS[0].title;
};
