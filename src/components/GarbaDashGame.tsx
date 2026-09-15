import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  NUM_LANES,
  LANE_WIDTH,
  getLaneX,
  CATCH_ZONE_Y,
  CATCH_TOLERANCE,
  TAPU_SENA,
  DAYA_DIALOGUES,
} from '../utils/constants';
import {
  FallingItem,
  DayaCharacter,
  Particle,
  FloatingText,
  GameStats,
  GameState,
  ItemType,
  ThrowerName,
} from '../types';
import { GarbaRenderer } from '../utils/renderer';
import { garbaAudio } from '../utils/audio';
import { ScoreHeader } from './ScoreHeader';
import { MobileControls } from './MobileControls';
import { InstructionsModal } from './InstructionsModal';
import { GameOverModal } from './GameOverModal';
import { Play, Sparkles } from 'lucide-react';

export const GarbaDashGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<GarbaRenderer | null>(null);
  const requestRef = useRef<number | null>(null);

  // High score from local storage
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('garba_dash_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [gameState, setGameState] = useState<GameState>('MENU');
  const [isMuted, setIsMuted] = useState<boolean>(() => garbaAudio.getMuted());
  const [isInstructionsOpen, setIsInstructionsOpen] = useState<boolean>(false);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  // Game Statistics
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    highScore: 0,
    combo: 0,
    maxCombo: 0,
    diyas: 3,
    frenzyMeter: 0,
    isFrenzy: false,
    frenzyTimeRemaining: 0,
    dandiyasCaught: 0,
    sweetsCaught: 0,
    obstaclesDodged: 0,
    perfectCatches: 0,
    level: 1,
    currentBpm: 108,
  });

  // Keep ref for high score & stats in animation loop
  const statsRef = useRef<GameStats>({
    score: 0,
    highScore,
    combo: 0,
    maxCombo: 0,
    diyas: 3,
    frenzyMeter: 0,
    isFrenzy: false,
    frenzyTimeRemaining: 0,
    dandiyasCaught: 0,
    sweetsCaught: 0,
    obstaclesDodged: 0,
    perfectCatches: 0,
    level: 1,
    currentBpm: 108,
  });

  // State refs for animation loop
  const itemsRef = useRef<FallingItem[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const lastSpawnTimeRef = useRef<number>(0);
  const nextSpawnIntervalRef = useRef<number>(1000);
  const lastFrameTimeRef = useRef<number>(0);
  const gameStateRef = useRef<GameState>('MENU');
  gameStateRef.current = gameState;

  // Daya Character State
  const dayaRef = useRef<DayaCharacter>({
    lane: 2,
    x: getLaneX(2),
    targetX: getLaneX(2),
    y: CATCH_ZONE_Y,
    width: 64,
    height: 72,
    isCatching: false,
    catchTimer: 0,
    isSpinning: false,
    spinAngle: 0,
    dialogue: null,
    dialogueTimer: 0,
    dandiyaAngleLeft: 0,
    dandiyaAngleRight: 0,
  });

  // Sync high score to statsRef
  useEffect(() => {
    statsRef.current.highScore = highScore;
    setStats((prev) => ({ ...prev, highScore }));
  }, [highScore]);

  // Handle Resize / Canvas Context initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      rendererRef.current = new GarbaRenderer(ctx);
    }
  }, []);

  // Spawn Particle burst
  const addParticles = useCallback(
    (
      x: number,
      y: number,
      color: string,
      count = 8,
      shape: 'circle' | 'star' | 'petal' | 'sparkle' = 'circle'
    ) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.5;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          size: Math.random() * 4 + 2,
          color,
          alpha: 1,
          life: 0,
          maxLife: Math.random() * 25 + 20,
          shape,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.2,
        });
      }
    },
    []
  );

  // Spawn Floating Text (+100, PERFECT!, etc.)
  const addFloatingText = useCallback(
    (text: string, x: number, y: number, color: string, isSpecial = false) => {
      floatingTextsRef.current.push({
        id: Math.random().toString(),
        text,
        x,
        y,
        vy: -1.8,
        color,
        alpha: 1,
        life: 0,
        scale: 1,
        isSpecial,
      });
    },
    []
  );

  // Daya Ben dialogue trigger
  const triggerDayaDialogue = useCallback((forcedLine?: string) => {
    const line =
      forcedLine ||
      DAYA_DIALOGUES[Math.floor(Math.random() * DAYA_DIALOGUES.length)];
    dayaRef.current.dialogue = line;
    dayaRef.current.dialogueTimer = 110; // ~1.8 seconds at 60fps
  }, []);

  // Move Daya to specific lane
  const moveToLane = useCallback((targetLane: number) => {
    const clamped = Math.max(0, Math.min(NUM_LANES - 1, targetLane));
    dayaRef.current.lane = clamped;
    dayaRef.current.targetX = getLaneX(clamped);
  }, []);

  const moveLeft = useCallback(() => {
    moveToLane(dayaRef.current.lane - 1);
  }, [moveToLane]);

  const moveRight = useCallback(() => {
    moveToLane(dayaRef.current.lane + 1);
  }, [moveToLane]);

  // Taali (Garba Clap Strike)
  const performTaaliCatch = useCallback(() => {
    if (gameStateRef.current !== 'PLAYING') return;

    dayaRef.current.isCatching = true;
    dayaRef.current.catchTimer = 14;

    // Check if any item in the current lane is currently in the catch zone
    const currentLane = dayaRef.current.lane;
    const catchableItem = itemsRef.current.find(
      (item) =>
        !item.caught &&
        !item.missed &&
        item.lane === currentLane &&
        Math.abs(item.y - CATCH_ZONE_Y) <= CATCH_TOLERANCE + 15
    );

    if (catchableItem) {
      handleItemHit(catchableItem, true);
    } else {
      // Just play a cheerful dandiya clack when clapping empty air
      garbaAudio.playDandiyaClack(1.0, false);
      addParticles(dayaRef.current.x, CATCH_ZONE_Y, '#fef08a', 4, 'sparkle');
    }
  }, [addParticles]);

  // Handle Item Catch / Hit
  const handleItemHit = useCallback(
    (item: FallingItem, isExplicitClap = false) => {
      item.caught = true;
      const s = statsRef.current;
      const daya = dayaRef.current;

      // Animate Daya's catch pose
      daya.isCatching = true;
      daya.catchTimer = 14;

      if (item.type === 'BHIDE_WHISTLE' || item.type === 'CRICKET_BALL') {
        // Obstacle hit! Bhide is angry!
        garbaAudio.playBhideWhistle();
        addParticles(item.x, item.y, '#ef4444', 16, 'circle');
        addFloatingText('-1 DIYA! BHIDE ANGRY!', item.x, item.y - 15, '#ef4444', true);

        // Deduct 1 Diya if not in Frenzy
        if (!s.isFrenzy) {
          s.diyas = Math.max(0, s.diyas - 1);
          s.combo = 0;
          if (s.diyas === 0) {
            triggerGameOver();
            return;
          }
        }
        triggerDayaDialogue('Arre Bhide Master!');
        setStats({ ...s });
        return;
      }

      if (item.type === 'JALEBI_FAFDA' || item.type === 'MODAK_SWEET') {
        // Sweet snack bonus from Goli!
        garbaAudio.playSweetBonus();
        addParticles(item.x, item.y, '#f59e0b', 14, 'petal');

        const bonusPts = (item.type === 'JALEBI_FAFDA' ? 500 : 300) * (s.isFrenzy ? 2 : 1);
        s.score += bonusPts;
        s.sweetsCaught += 1;

        // Restore 1 Diya if lost
        if (s.diyas < 3) {
          s.diyas += 1;
          addFloatingText('+1 DIYA RESTORED!', item.x, item.y - 25, '#10b981', true);
        } else {
          addFloatingText(`+${bonusPts} JALEBI BONUS!`, item.x, item.y - 15, '#f59e0b', true);
        }

        triggerDayaDialogue('Goli beta, Jalebi-Fafda majaa aavi gayo!');
        setStats({ ...s });
        return;
      }

      // Dandiya Catch!
      s.dandiyasCaught += 1;
      s.combo += 1;
      if (s.combo > s.maxCombo) {
        s.maxCombo = s.combo;
      }

      // Calculate rhythm timing accuracy
      const diffY = Math.abs(item.y - CATCH_ZONE_Y);
      let timingText = 'GOOD!';
      let basePts = 100;
      let isPerfect = false;

      if (diffY <= 15) {
        timingText = 'PERFECT GARBA!';
        basePts = 200;
        isPerfect = true;
        s.perfectCatches += 1;
      } else if (diffY <= 30) {
        timingText = 'GREAT!';
        basePts = 150;
      }

      if (item.type === 'DANDIYA_GOLD') {
        basePts += 150;
        s.frenzyMeter = Math.min(100, s.frenzyMeter + 20);
      } else {
        s.frenzyMeter = Math.min(100, s.frenzyMeter + 8);
      }

      // Frenzy 2X Multiplier
      const finalMultiplier = (s.isFrenzy ? 2 : 1) * (s.combo >= 15 ? 2 : s.combo >= 8 ? 1.5 : 1);
      const earned = Math.round(basePts * finalMultiplier);
      s.score += earned;

      // Pitch-scaled dandiya clack (higher pitch as combo rises)
      const pitch = Math.min(1.6, 1.0 + s.combo * 0.03);
      garbaAudio.playDandiyaClack(pitch, isPerfect);

      // Visuals
      const particleColor =
        item.type === 'DANDIYA_GOLD' ? '#fbbf24' : isPerfect ? '#f43f5e' : '#f59e0b';
      addParticles(item.x, item.y, particleColor, isPerfect ? 14 : 8, isPerfect ? 'star' : 'sparkle');
      addFloatingText(
        `+${earned} ${timingText}`,
        item.x,
        item.y - 15,
        isPerfect ? '#fef08a' : '#fbbf24',
        isPerfect
      );

      // Check for Super Garba Frenzy activation
      if (!s.isFrenzy && s.frenzyMeter >= 100) {
        activateFrenzy();
      }

      // Check for milestone dialogues
      if (s.combo === 10) {
        triggerDayaDialogue('Ae Halo Halo! 10x Combo!');
      } else if (s.combo === 25) {
        triggerDayaDialogue('Hey Maa Mataji! 25x Non-stop!');
      } else if (Math.random() < 0.12) {
        triggerDayaDialogue();
      }

      // Level progression check (every 1000 points)
      const calculatedLevel = Math.floor(s.score / 1000) + 1;
      if (calculatedLevel > s.level) {
        s.level = calculatedLevel;
        s.currentBpm = Math.min(144, 108 + (s.level - 1) * 6);
        garbaAudio.updateBpm(s.currentBpm, s.isFrenzy);
        addFloatingText(`ROUND ${s.level} - TEMPO UP!`, CANVAS_WIDTH / 2, CATCH_ZONE_Y - 80, '#f43f5e', true);
      }

      setStats({ ...s });
    },
    [addFloatingText, addParticles, triggerDayaDialogue]
  );

  // Activate Super Garba Frenzy
  const activateFrenzy = useCallback(() => {
    const s = statsRef.current;
    s.isFrenzy = true;
    s.frenzyMeter = 100;
    s.frenzyTimeRemaining = 10; // 10 seconds frenzy!

    dayaRef.current.isSpinning = true;
    garbaAudio.playFrenzyStart();
    garbaAudio.updateBpm(s.currentBpm, true);

    addParticles(CANVAS_WIDTH / 2, CATCH_ZONE_Y, '#fbbf24', 30, 'star');
    addFloatingText('⚡ SUPER GARBA FRENZY! 2X POINTS! ⚡', CANVAS_WIDTH / 2, CATCH_ZONE_Y - 60, '#fef08a', true);
    triggerDayaDialogue('Cyclone Garba Express shuru!');
  }, [addFloatingText, addParticles, triggerDayaDialogue]);

  // Trigger Game Over
  const triggerGameOver = useCallback(() => {
    gameStateRef.current = 'GAMEOVER';
    setGameState('GAMEOVER');
    garbaAudio.stopGarbaBeat();
    garbaAudio.playMissThud();

    const s = statsRef.current;
    if (s.score > s.highScore) {
      s.highScore = s.score;
      setHighScore(s.score);
      setIsNewHighScore(true);
      try {
        localStorage.setItem('garba_dash_highscore', String(s.score));
      } catch {}
    } else {
      setIsNewHighScore(false);
    }
  }, []);

  // Start / Restart Game
  const startGame = useCallback(() => {
    garbaAudio.initCtx();

    // Reset stats
    statsRef.current = {
      score: 0,
      highScore: highScore,
      combo: 0,
      maxCombo: 0,
      diyas: 3,
      frenzyMeter: 0,
      isFrenzy: false,
      frenzyTimeRemaining: 0,
      dandiyasCaught: 0,
      sweetsCaught: 0,
      obstaclesDodged: 0,
      perfectCatches: 0,
      level: 1,
      currentBpm: 108,
    };
    setStats({ ...statsRef.current });

    // Reset entities
    itemsRef.current = [];
    particlesRef.current = [];
    floatingTextsRef.current = [];
    lastSpawnTimeRef.current = 0;
    nextSpawnIntervalRef.current = 800;

    dayaRef.current = {
      lane: 2,
      x: getLaneX(2),
      targetX: getLaneX(2),
      y: CATCH_ZONE_Y,
      width: 64,
      height: 72,
      isCatching: false,
      catchTimer: 0,
      isSpinning: false,
      spinAngle: 0,
      dialogue: 'Haalo Re Haalo!',
      dialogueTimer: 90,
      dandiyaAngleLeft: 0,
      dandiyaAngleRight: 0,
    };

    setIsNewHighScore(false);
    gameStateRef.current = 'PLAYING';
    setGameState('PLAYING');

    garbaAudio.startGarbaBeat(108);
  }, [highScore]);

  // Pause toggle
  const togglePause = useCallback(() => {
    if (gameStateRef.current === 'PLAYING') {
      gameStateRef.current = 'PAUSED';
      setGameState('PAUSED');
      garbaAudio.stopGarbaBeat();
    } else if (gameStateRef.current === 'PAUSED') {
      gameStateRef.current = 'PLAYING';
      setGameState('PLAYING');
      garbaAudio.startGarbaBeat(statsRef.current.currentBpm);
    }
  }, []);

  // Mute toggle
  const toggleMute = useCallback(() => {
    const muted = garbaAudio.toggleMute();
    setIsMuted(muted);
  }, []);

  // Quick soundboard "Hey Maa Mataji!"
  const handleTriggerHeyMaaMataji = useCallback(() => {
    garbaAudio.playHeyMaaMataji();
    triggerDayaDialogue('Hey Maa Mataji!');
    addParticles(dayaRef.current.x, CATCH_ZONE_Y, '#f43f5e', 12, 'petal');
  }, [addParticles, triggerDayaDialogue]);

  // Spawn an item from Tapu Sena
  const spawnItem = useCallback((time: number) => {
    const s = statsRef.current;

    // Pick random lane (0 to 4)
    const lane = Math.floor(Math.random() * NUM_LANES);
    const thrower = TAPU_SENA[lane].name;
    const startX = getLaneX(lane);
    const startY = 145; // Just below balcony

    // Decide item type
    const roll = Math.random();
    let type: ItemType = 'DANDIYA_RED';
    let isObstacle = false;
    let points = 100;

    if (roll < 0.58) {
      type = 'DANDIYA_RED';
      points = 100;
    } else if (roll < 0.76) {
      type = 'DANDIYA_GOLD';
      points = 250;
    } else if (roll < 0.86) {
      type = 'DANDIYA_DUAL';
      points = 200;
    } else if (roll < 0.94) {
      // Sweets! Goli loves jalebi!
      type = thrower === 'Goli' || Math.random() < 0.6 ? 'JALEBI_FAFDA' : 'MODAK_SWEET';
      points = 300;
    } else {
      // Obstacle: Bhide's whistle or stray ball
      type = Math.random() < 0.6 ? 'BHIDE_WHISTLE' : 'CRICKET_BALL';
      isObstacle = true;
    }

    // Item fall speed based on BPM & level
    const baseSpeed = 3.8 + (s.level - 1) * 0.45;
    const speed = s.isFrenzy ? baseSpeed * 1.15 : baseSpeed;

    itemsRef.current.push({
      id: Math.random().toString(),
      type,
      lane,
      x: startX,
      y: startY,
      speed,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.08,
      thrower,
      caught: false,
      missed: false,
      points,
      isObstacle,
      scale: 1,
    });

    // Little launch spark
    addParticles(startX, startY, TAPU_SENA[lane].color, 4, 'circle');

    // Next interval calculation based on BPM
    const bpm = s.isFrenzy ? s.currentBpm * 1.3 : s.currentBpm;
    // Beat duration in ms = (60 / bpm) * 1000
    const beatDuration = (60 / bpm) * 1000;
    // Spawn every 1 to 1.5 beats
    nextSpawnIntervalRef.current = beatDuration * (0.8 + Math.random() * 0.5);
    lastSpawnTimeRef.current = time;
  }, [addParticles]);

  // Main Animation / Game Loop
  useEffect(() => {
    const loop = (timestamp: number) => {
      if (!lastFrameTimeRef.current) lastFrameTimeRef.current = timestamp;
      const dt = Math.min(60, timestamp - lastFrameTimeRef.current);
      lastFrameTimeRef.current = timestamp;

      const currentGameState = gameStateRef.current;
      const s = statsRef.current;
      const daya = dayaRef.current;

      if (currentGameState === 'PLAYING') {
        // 1. Spawning
        if (timestamp - lastSpawnTimeRef.current >= nextSpawnIntervalRef.current) {
          spawnItem(timestamp);
        }

        // 2. Update Frenzy Timer
        if (s.isFrenzy) {
          s.frenzyTimeRemaining -= dt / 1000;
          if (s.frenzyTimeRemaining <= 0) {
            s.isFrenzy = false;
            s.frenzyMeter = 0;
            daya.isSpinning = false;
            garbaAudio.updateBpm(s.currentBpm, false);
          }
        }

        // 3. Smooth Daya X movement towards target lane
        daya.x += (daya.targetX - daya.x) * 0.28;

        // Catch animation timer
        if (daya.isCatching) {
          daya.catchTimer -= 1;
          if (daya.catchTimer <= 0) {
            daya.isCatching = false;
          }
        }

        // Garba 360 spin in frenzy
        if (daya.isSpinning) {
          daya.spinAngle += 0.16;
        }

        // Dialogue timer
        if (daya.dialogue) {
          daya.dialogueTimer -= 1;
          if (daya.dialogueTimer <= 0) {
            daya.dialogue = null;
          }
        }

        // 4. Update Falling Items
        for (let i = itemsRef.current.length - 1; i >= 0; i--) {
          const item = itemsRef.current[i];
          item.y += item.speed;
          item.rotation += item.rotSpeed;

          // Auto-catch check: If item enters catch line and Daya is in the same lane
          if (
            !item.caught &&
            !item.missed &&
            item.lane === daya.lane &&
            Math.abs(item.y - CATCH_ZONE_Y) <= CATCH_TOLERANCE
          ) {
            handleItemHit(item, false);
          }

          // Miss check: Item passed bottom of catch line
          if (!item.caught && !item.missed && item.y > CATCH_ZONE_Y + CATCH_TOLERANCE + 15) {
            item.missed = true;
            if (!item.isObstacle && item.type.startsWith('DANDIYA')) {
              // Missed a dandiya!
              garbaAudio.playMissThud();
              addFloatingText('MISS!', item.x, item.y, '#94a3b8');

              if (!s.isFrenzy) {
                s.diyas = Math.max(0, s.diyas - 1);
                s.combo = 0;
                setStats({ ...s });
                if (s.diyas === 0) {
                  triggerGameOver();
                  break;
                }
              }
            } else if (item.isObstacle) {
              // Successfully dodged obstacle!
              s.obstaclesDodged += 1;
              s.score += 50;
              addFloatingText('+50 DODGED!', item.x, item.y, '#38bdf8');
              setStats({ ...s });
            }
          }

          // Cleanup item if below screen
          if (item.y > CANVAS_HEIGHT + 40 || item.caught) {
            itemsRef.current.splice(i, 1);
          }
        }

        // 5. Update Particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life += 1;
          p.alpha = 1 - p.life / p.maxLife;
          if (p.vRot) p.rotation = (p.rotation || 0) + p.vRot;

          if (p.life >= p.maxLife) {
            particlesRef.current.splice(i, 1);
          }
        }

        // 6. Update Floating Texts
        for (let i = floatingTextsRef.current.length - 1; i >= 0; i--) {
          const ft = floatingTextsRef.current[i];
          ft.y += ft.vy;
          ft.life += 1;
          ft.alpha = Math.max(0, 1 - ft.life / 35);

          if (ft.life >= 35) {
            floatingTextsRef.current.splice(i, 1);
          }
        }
      }

      // 7. Render Everything on Canvas
      if (rendererRef.current) {
        rendererRef.current.render(
          itemsRef.current,
          dayaRef.current,
          particlesRef.current,
          floatingTextsRef.current,
          s,
          timestamp
        );
      }

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [handleItemHit, spawnItem, triggerGameOver, addFloatingText]);

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (gameStateRef.current === 'MENU' || gameStateRef.current === 'GAMEOVER') {
          startGame();
        } else if (gameStateRef.current === 'PLAYING') {
          performTaaliCatch();
        }
        return;
      }

      if (gameStateRef.current !== 'PLAYING') return;

      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft();
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveRight();
          break;
        case 'Digit1':
        case 'KeyQ':
          moveToLane(0);
          break;
        case 'Digit2':
        case 'KeyW':
          moveToLane(1);
          break;
        case 'Digit3':
        case 'KeyE':
          moveToLane(2);
          break;
        case 'Digit4':
        case 'KeyR':
          moveToLane(3);
          break;
        case 'Digit5':
        case 'KeyT':
          moveToLane(4);
          break;
        case 'KeyP':
          togglePause();
          break;
        case 'KeyM':
          toggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startGame, performTaaliCatch, moveLeft, moveRight, moveToLane, togglePause, toggleMute]);

  // Canvas Click / Tap Lane Selection
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'PLAYING') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const clickX = (e.clientX - rect.left) * scaleX;

    const clickedLane = Math.floor(clickX / LANE_WIDTH);
    if (clickedLane >= 0 && clickedLane < NUM_LANES) {
      if (clickedLane === dayaRef.current.lane) {
        // Tapping current lane triggers Taali catch!
        performTaaliCatch();
      } else {
        moveToLane(clickedLane);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center select-none">
      {/* Game Header Bar */}
      <ScoreHeader
        stats={stats}
        isMuted={isMuted}
        isPaused={gameState === 'PAUSED'}
        onToggleMute={toggleMute}
        onTogglePause={togglePause}
        onOpenInstructions={() => setIsInstructionsOpen(true)}
        onTriggerHeyMaaMataji={handleTriggerHeyMaaMataji}
      />

      {/* Main Canvas Stage */}
      <div className="relative w-full max-w-lg aspect-[2/3] max-h-[72vh] overflow-hidden rounded-b-xl border-x border-b border-amber-500/30 shadow-2xl bg-black">
        <canvas
          id="garba-dash-canvas"
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onClick={handleCanvasClick}
          className="w-full h-full object-contain cursor-pointer"
        />

        {/* Start / Menu Overlay */}
        {gameState === 'MENU' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white animate-in fade-in">
            {/* Dandiya Logo */}
            <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 via-pink-600 to-yellow-300 rounded-3xl flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(245,158,11,0.5)] border-2 border-white/40 mb-3 animate-pulse">
              🪘
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-yellow-200 font-serif tracking-wide">
              Daya's Garba Dash
            </h1>
            <p className="text-xs text-amber-200/90 font-medium mt-1 max-w-xs">
              Catch Tapu Sena's flying dandiyas to lively Gokuldham Garba Dhol beats!
            </p>

            {/* Quick Badges */}
            <div className="flex items-center gap-2 my-4">
              <span className="text-[11px] bg-pink-950/80 border border-pink-400/40 text-pink-200 px-3 py-1 rounded-full font-bold">
                5 Rhythm Lanes
              </span>
              <span className="text-[11px] bg-amber-950/80 border border-amber-400/40 text-amber-200 px-3 py-1 rounded-full font-bold">
                Jalebi & Fafda Power
              </span>
            </div>

            {/* Play Button */}
            <button
              id="btn-start-game"
              onClick={startGame}
              className="w-full max-w-xs py-3.5 bg-gradient-to-r from-amber-500 via-pink-600 to-amber-500 hover:opacity-95 active:scale-95 text-white font-black text-base rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center gap-2 mb-2"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Ae Halo! Start Garba</span>
            </button>

            {/* Instructions link */}
            <button
              id="btn-menu-how-to-play"
              onClick={() => setIsInstructionsOpen(true)}
              className="text-xs text-amber-300/80 hover:text-amber-200 underline underline-offset-4 mt-1 font-semibold"
            >
              How to Play & Tapu Sena Lanes
            </button>
          </div>
        )}

        {/* Pause Overlay */}
        {gameState === 'PAUSED' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <h2 className="text-3xl font-black text-amber-300 font-serif mb-2">
              Garba Paused!
            </h2>
            <p className="text-xs text-slate-300 mb-5">
              Daya ben is drinking water, resuming in a moment!
            </p>
            <button
              id="btn-resume-game"
              onClick={togglePause}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-pink-600 font-black text-sm rounded-xl shadow-lg active:scale-95"
            >
              Resume Garba
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch & Navigation Controls */}
      <MobileControls
        currentLane={dayaRef.current.lane}
        onMoveLeft={moveLeft}
        onMoveRight={moveRight}
        onSelectLane={moveToLane}
        onClap={performTaaliCatch}
      />

      {/* Game Over Celebration Modal */}
      {gameState === 'GAMEOVER' && (
        <GameOverModal
          stats={stats}
          isNewHighScore={isNewHighScore}
          onRestart={startGame}
        />
      )}

      {/* Instructions & Lore Modal */}
      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />
    </div>
  );
};
