import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  NUM_LANES,
  LANE_WIDTH,
  getLaneX,
  CATCH_ZONE_Y,
  TAPU_SENA,
} from './constants';
import {
  FallingItem,
  DayaCharacter,
  Particle,
  FloatingText,
  GameStats,
} from '../types';

export class GarbaRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public render(
    items: FallingItem[],
    daya: DayaCharacter,
    particles: Particle[],
    floatingTexts: FloatingText[],
    stats: GameStats,
    gameTime: number
  ): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 1. Festive Gokuldham Navratri Background
    this.drawBackground(gameTime, stats.isFrenzy);

    // 2. Lanes and Floor Rangoli Mandala
    this.drawLanesAndFloor(stats.isFrenzy, gameTime);

    // 3. Catch Zone Rhythm Bar
    this.drawCatchZone(daya.lane, gameTime, stats.isFrenzy);

    // 4. Tapu Sena Balcony at Top
    this.drawTapuSenaBalcony(gameTime);

    // 5. Falling Items (Dandiyas, Sweets, Obstacles)
    for (const item of items) {
      this.drawFallingItem(item, gameTime);
    }

    // 6. Particles (Petals, Sparks, Confetti)
    this.drawParticles(particles);

    // 7. Daya Ben Character
    this.drawDaya(daya, gameTime, stats.isFrenzy);

    // 8. Floating Scores & Rhythm Timing texts
    this.drawFloatingTexts(floatingTexts);

    // 9. Frenzy Screen Effect (Golden sparkles & disco-garba lights)
    if (stats.isFrenzy) {
      this.drawFrenzyAura(gameTime);
    }
  }

  // --- 1. BACKGROUND ---
  private drawBackground(gameTime: number, isFrenzy: boolean): void {
    const ctx = this.ctx;

    // Rich evening sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    if (isFrenzy) {
      // Golden celebratory purple-amber festive sky
      skyGrad.addColorStop(0, '#2d0036');
      skyGrad.addColorStop(0.4, '#4a0842');
      skyGrad.addColorStop(0.7, '#6b1135');
      skyGrad.addColorStop(1, '#831843');
    } else {
      // Gokuldham Society Navratri Night Sky (deep indigo to midnight warm teal)
      skyGrad.addColorStop(0, '#0a0a23');
      skyGrad.addColorStop(0.4, '#12133a');
      skyGrad.addColorStop(0.7, '#1f1642');
      skyGrad.addColorStop(1, '#2c1236');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Crescent Moon with soft spiritual aura
    ctx.save();
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH - 60, 48, 20, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(254, 240, 138, 0.2)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH - 60, 48, 16, 0.4, Math.PI * 1.6, false);
    ctx.fillStyle = '#fef08a';
    ctx.fill();
    ctx.restore();

    // Twinkling stars
    for (let i = 0; i < 24; i++) {
      const sx = ((i * 47) + 23) % CANVAS_WIDTH;
      const sy = ((i * 31) + 11) % 180;
      const twinkle = Math.sin(gameTime * 0.003 + i) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + twinkle * 0.6})`;
      ctx.fillRect(sx, sy, 2, 2);
    }

    // Gokuldham Society Building Silhouettes (Wings A, B, C)
    ctx.fillStyle = '#080816';
    // Wing A
    ctx.fillRect(15, 80, 75, 120);
    // Wing B (Center)
    ctx.fillRect(160, 60, 160, 140);
    // Wing C
    ctx.fillRect(390, 85, 75, 115);

    // Warm lighted windows in flats
    ctx.fillStyle = 'rgba(254, 215, 170, 0.65)';
    for (let row = 0; row < 3; row++) {
      ctx.fillRect(35, 95 + row * 32, 14, 18);
      ctx.fillRect(60, 95 + row * 32, 14, 18);

      ctx.fillRect(190, 80 + row * 32, 16, 20);
      ctx.fillRect(230, 80 + row * 32, 16, 20);
      ctx.fillRect(270, 80 + row * 32, 16, 20);

      ctx.fillRect(410, 100 + row * 30, 14, 18);
      ctx.fillRect(435, 100 + row * 30, 14, 18);
    }

    // Hanging Marigold (Genda Phool) Torans and Fairy Lights
    this.drawToransAndFairyLights(gameTime);
  }

  /** Marigold flower toran garland across society courtyard */
  private drawToransAndFairyLights(gameTime: number): void {
    const ctx = this.ctx;
    ctx.save();

    // Draped rope curves
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;

    const numArcs = 4;
    const arcW = CANVAS_WIDTH / numArcs;
    const lightColors = ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#fbbf24'];

    for (let i = 0; i < numArcs; i++) {
      const x1 = i * arcW;
      const x2 = (i + 1) * arcW;
      const midX = (x1 + x2) / 2;
      const yBase = 112;

      ctx.beginPath();
      ctx.moveTo(x1, yBase);
      ctx.quadraticCurveTo(midX, yBase + 20, x2, yBase);
      ctx.stroke();

      // Hanging little fairy bulbs along the curve
      for (let b = 1; b < 5; b++) {
        const t = b / 5;
        const bx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
        const by = (1 - t) * (1 - t) * yBase + 2 * (1 - t) * t * (yBase + 20) + t * t * yBase;

        const colorIdx = (i * 4 + b) % lightColors.length;
        const pulse = Math.sin(gameTime * 0.005 + b + i) * 0.3 + 0.7;

        ctx.fillStyle = lightColors[colorIdx];
        ctx.beginPath();
        ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Little light aura
        ctx.fillStyle = `rgba(255, 255, 255, ${pulse * 0.4})`;
        ctx.beginPath();
        ctx.arc(bx, by, 6, 0, Math.PI * 2);
        ctx.fill();

        // Alternate with orange/yellow marigold flower pompoms
        if (b % 2 === 0) {
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(bx, by + 6, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(bx, by + 6, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }

  // --- 2. LANES & FLOOR ---
  private drawLanesAndFloor(isFrenzy: boolean, gameTime: number): void {
    const ctx = this.ctx;

    // Floor starting from Y = 200 down to bottom
    const floorY = 160;
    const floorGrad = ctx.createLinearGradient(0, floorY, 0, CANVAS_HEIGHT);
    floorGrad.addColorStop(0, 'rgba(30, 10, 45, 0.7)');
    floorGrad.addColorStop(1, 'rgba(15, 6, 24, 0.95)');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorY, CANVAS_WIDTH, CANVAS_HEIGHT - floorY);

    // 5 Rhythm Lanes with subtle illuminated translucent dividers
    for (let lane = 0; lane < NUM_LANES; lane++) {
      const lx = lane * LANE_WIDTH;

      // Lane dividers
      if (lane > 0) {
        ctx.strokeStyle = isFrenzy ? 'rgba(245, 158, 11, 0.35)' : 'rgba(255, 255, 255, 0.1)';
        ctx.setLineDash([6, 8]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(lx, floorY);
        ctx.lineTo(lx, CANVAS_HEIGHT);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Traditional Indian Rangoli Mandala in the center stage floor
    ctx.save();
    ctx.translate(CANVAS_WIDTH / 2, CATCH_ZONE_Y);
    const rangoliAlpha = isFrenzy ? 0.35 : 0.2;
    ctx.strokeStyle = `rgba(251, 191, 36, ${rangoliAlpha})`;
    ctx.lineWidth = 1.5;

    // Concentric Rangoli circles
    ctx.beginPath();
    ctx.arc(0, 0, 75, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 110, 0, Math.PI * 2);
    ctx.stroke();

    // Rotating 8-petal lotus pattern
    const rot = (gameTime * 0.0006) % (Math.PI * 2);
    ctx.rotate(rot);
    for (let p = 0; p < 8; p++) {
      ctx.rotate((Math.PI * 2) / 8);
      ctx.beginPath();
      ctx.ellipse(0, 45, 14, 25, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(244, 114, 182, ${rangoliAlpha * 1.2})`;
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- 3. CATCH ZONE BAR ---
  private drawCatchZone(dayaLane: number, gameTime: number, isFrenzy: boolean): void {
    const ctx = this.ctx;
    const cy = CATCH_ZONE_Y;

    // Glowing catch line
    const grad = ctx.createLinearGradient(0, cy - 8, 0, cy + 8);
    grad.addColorStop(0, 'rgba(251, 191, 36, 0)');
    grad.addColorStop(0.5, isFrenzy ? 'rgba(250, 204, 21, 0.6)' : 'rgba(236, 72, 153, 0.45)');
    grad.addColorStop(1, 'rgba(251, 191, 36, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, cy - 8, CANVAS_WIDTH, 16);

    // Line markers for each lane
    for (let lane = 0; lane < NUM_LANES; lane++) {
      const cx = getLaneX(lane);
      const isTarget = lane === dayaLane;

      // Catch target disc
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, isTarget ? 24 : 18, 0, Math.PI * 2);
      ctx.fillStyle = isTarget
        ? 'rgba(245, 158, 11, 0.25)'
        : 'rgba(255, 255, 255, 0.05)';
      ctx.fill();

      ctx.strokeStyle = isTarget
        ? (isFrenzy ? '#fef08a' : '#f59e0b')
        : 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = isTarget ? 2.5 : 1;
      ctx.stroke();

      // If active target, draw dancing rhythm pulse ring
      if (isTarget) {
        const pulse = (Math.sin(gameTime * 0.008) * 0.5 + 0.5) * 6;
        ctx.beginPath();
        ctx.arc(cx, cy, 26 + pulse, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Small diya icon at bottom of lane
      this.drawMiniDiya(cx, cy + 24, isTarget, gameTime);
      ctx.restore();
    }
  }

  /** Small glowing Diya on stage */
  private drawMiniDiya(x: number, y: number, isLit: boolean, gameTime: number): void {
    const ctx = this.ctx;
    // Diya clay base
    ctx.fillStyle = isLit ? '#d97706' : '#78350f';
    ctx.beginPath();
    ctx.ellipse(x, y, 9, 4.5, 0, 0, Math.PI);
    ctx.fill();

    // Diya flame
    if (isLit) {
      const flicker = Math.sin(gameTime * 0.015 + x) * 1.5;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(x - 3, y);
      ctx.quadraticCurveTo(x, y - 9 + flicker, x + 3, y);
      ctx.fill();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(x, y - 2, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- 4. TAPU SENA BALCONY ---
  private drawTapuSenaBalcony(gameTime: number): void {
    const ctx = this.ctx;

    // Balcony Railing Banner
    const balconyY = 145;
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0, 115, CANVAS_WIDTH, 42);

    // Decorative Gokuldham Society Golden Grill
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 115, CANVAS_WIDTH, 42);

    // Railing posts
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
    ctx.lineWidth = 1;
    for (let x = 12; x < CANVAS_WIDTH; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, 115);
      ctx.lineTo(x, 157);
      ctx.stroke();
    }

    // Tapu Sena Members along their respective lanes
    for (let i = 0; i < TAPU_SENA.length; i++) {
      const member = TAPU_SENA[i];
      const cx = getLaneX(member.lane);
      const bob = Math.sin(gameTime * 0.005 + i * 1.2) * 2;

      this.drawTapuSenaKid(cx, 110 + bob, member);
    }
  }

  /** Draws an individual stylized Tapu Sena member on the balcony */
  private drawTapuSenaKid(cx: number, cy: number, member: (typeof TAPU_SENA)[0]): void {
    const ctx = this.ctx;
    ctx.save();

    // Name badge overhead
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.beginPath();
    ctx.roundRect(cx - 24, cy - 42, 48, 14, 4);
    ctx.fill();

    ctx.fillStyle = member.color;
    ctx.font = 'bold 10px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(member.name, cx, cy - 31);

    // Torso / Kurta
    ctx.fillStyle = member.color;
    ctx.beginPath();
    ctx.roundRect(cx - 12, cy - 18, 24, 22, 4);
    ctx.fill();

    // Face / Head
    ctx.fillStyle = '#fed7aa'; // Indian skin tone
    ctx.beginPath();
    ctx.arc(cx, cy - 18, 10, 0, Math.PI * 2);
    ctx.fill();

    // Hair / Accessories
    ctx.fillStyle = '#1e1b4b';
    if (member.name === 'Gogi') {
      // Turban (Patka)
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(cx, cy - 22, 11, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(cx - 11, cy - 22, 22, 4);
      // Small turban topknot
      ctx.beginPath();
      ctx.arc(cx, cy - 25, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (member.name === 'Sonu') {
      // Girl hairstyle with braid
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.arc(cx, cy - 20, 11, Math.PI * 0.9, Math.PI * 2.1);
      ctx.fill();
      // Ponytails
      ctx.fillRect(cx - 13, cy - 18, 4, 12);
      ctx.fillRect(cx + 9, cy - 18, 4, 12);
    } else if (member.name === 'Goli') {
      // Goli's round cheerful face
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.arc(cx, cy - 22, 10, Math.PI, Math.PI * 2);
      ctx.fill();
    } else {
      // Tapu & Pinku cool cropped hair
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(cx, cy - 21, 10, Math.PI, Math.PI * 2);
      ctx.fill();
    }

    // Pinku's Glasses
    if (member.name === 'Pinku') {
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx - 7, cy - 20, 5, 4);
      ctx.strokeRect(cx + 2, cy - 20, 5, 4);
      ctx.beginPath();
      ctx.moveTo(cx - 2, cy - 18);
      ctx.lineTo(cx + 2, cy - 18);
      ctx.stroke();
    }

    // Cheerful smiling eyes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx - 4, cy - 18, 2, 2);
    ctx.fillRect(cx + 2, cy - 18, 2, 2);

    // Smile
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy - 16, 3, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Throwing hands
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(cx - 14, cy - 10, 4, 0, Math.PI * 2);
    ctx.arc(cx + 14, cy - 10, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // --- 5. FALLING ITEMS ---
  private drawFallingItem(item: FallingItem, gameTime: number): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(item.rotation);
    ctx.scale(item.scale, item.scale);

    switch (item.type) {
      case 'DANDIYA_RED':
        this.renderDandiyaStick(ctx, '#ef4444', '#f59e0b', '#10b981');
        break;

      case 'DANDIYA_GOLD':
        // Golden sparkling aura
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 12;
        this.renderDandiyaStick(ctx, '#fbbf24', '#fef08a', '#d97706');
        break;

      case 'DANDIYA_DUAL':
        // Crossed pair
        ctx.save();
        ctx.rotate(-0.35);
        this.renderDandiyaStick(ctx, '#ec4899', '#fbcfe8', '#831843');
        ctx.restore();
        ctx.save();
        ctx.rotate(0.35);
        this.renderDandiyaStick(ctx, '#3b82f6', '#93c5fd', '#1e40af');
        ctx.restore();
        break;

      case 'JALEBI_FAFDA':
        this.renderJalebiFafda(ctx, gameTime);
        break;

      case 'MODAK_SWEET':
        this.renderModak(ctx);
        break;

      case 'BHIDE_WHISTLE':
        this.renderBhideWhistle(ctx, gameTime);
        break;

      case 'CRICKET_BALL':
        this.renderCricketBall(ctx);
        break;
    }

    ctx.restore();
  }

  /** Render traditional decorated Indian Dandiya stick */
  private renderDandiyaStick(
    ctx: CanvasRenderingContext2D,
    c1: string,
    c2: string,
    c3: string
  ): void {
    const length = 56;
    const width = 8;

    // Wood core body
    ctx.fillStyle = c1;
    ctx.beginPath();
    ctx.roundRect(-width / 2, -length / 2, width, length, 4);
    ctx.fill();

    // Decorative spiral stripes
    const stripeCount = 6;
    for (let i = 0; i < stripeCount; i++) {
      const sy = -length / 2 + 6 + i * 8;
      ctx.fillStyle = i % 2 === 0 ? c2 : c3;
      ctx.fillRect(-width / 2, sy, width, 3);
    }

    // Top and Bottom Golden caps
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, -length / 2, width / 2 + 1, 0, Math.PI * 2);
    ctx.arc(0, length / 2, width / 2 + 1, 0, Math.PI * 2);
    ctx.fill();

    // Little hanging bells & silk tassels at the handle
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(-3, length / 2);
    ctx.lineTo(0, length / 2 + 10);
    ctx.lineTo(3, length / 2);
    ctx.fill();

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, length / 2 + 2, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  /** Render Goli's favorite Jalebi & Fafda plate */
  private renderJalebiFafda(ctx: CanvasRenderingContext2D, gameTime: number): void {
    // Golden glow
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 8;

    // Stainless steel plate
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Crispy golden spiraled Jalebi
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let a = 0; a < Math.PI * 4; a += 0.4) {
      const r = 2 + a * 1.8;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (a === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Fafda strip
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-12, -4, 24, 5);
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1;
    ctx.strokeRect(-12, -4, 24, 5);
  }

  /** Render sacred festive Modak sweet */
  private renderModak(ctx: CanvasRenderingContext2D): void {
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 6;

    // Modak pleated teardrop shape
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.quadraticCurveTo(14, -2, 10, 12);
    ctx.quadraticCurveTo(0, 16, -10, 12);
    ctx.quadraticCurveTo(-14, -2, 0, -16);
    ctx.fill();

    // Saffron lines
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.lineTo(0, 14);
    ctx.moveTo(-5, -6);
    ctx.lineTo(-5, 12);
    ctx.moveTo(5, -6);
    ctx.lineTo(5, 12);
    ctx.stroke();
  }

  /** Render Bhide Master's Whistle (Obstacle!) */
  private renderBhideWhistle(ctx: CanvasRenderingContext2D, gameTime: number): void {
    // Red danger warning pulse
    const pulse = Math.sin(gameTime * 0.02) * 0.5 + 0.5;
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 8 + pulse * 6;

    // Whistle body (metallic silver)
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(-4, 2, 9, 0, Math.PI * 2);
    ctx.fill();

    // Whistle mouthpiece
    ctx.fillRect(-2, -6, 16, 7);

    // Whistle lanyard ring
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-14, 2, 4, 0, Math.PI * 2);
    ctx.stroke();

    // Sound wave vibration lines
    ctx.strokeStyle = `rgba(239, 68, 68, ${0.5 + pulse * 0.5})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(16, -2, 6, -0.6, 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(20, -2, 10, -0.6, 0.6);
    ctx.stroke();
  }

  /** Render Goli's stray cricket tennis ball */
  private renderCricketBall(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.fill();

    // White seam stitches
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.arc(0, 0, 13, -Math.PI * 0.6, Math.PI * 0.6);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // --- 6. PARTICLES ---
  private drawParticles(particles: Particle[]): void {
    const ctx = this.ctx;
    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;

      if (p.shape === 'petal') {
        // Floating Marigold / Rose petal
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation || 0);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 1.8, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'sparkle' || p.shape === 'star') {
        // Four-pointed star sparkle
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation || 0);
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.rotate(Math.PI / 2);
          ctx.lineTo(p.size * 2, 0);
          ctx.lineTo(p.size * 0.4, p.size * 0.4);
        }
        ctx.fill();
      } else {
        // Simple circle spark
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // --- 7. DAYA BEN CHARACTER (THE GARBA QUEEN) ---
  private drawDaya(daya: DayaCharacter, gameTime: number, isFrenzy: boolean): void {
    const ctx = this.ctx;
    ctx.save();

    const dx = daya.x;
    const dy = daya.y;

    ctx.translate(dx, dy);

    // If spinning, apply 360 Garba spin rotation
    if (daya.isSpinning) {
      ctx.rotate(daya.spinAngle);
    }

    // Garba rhythm bounce step
    const garbaStep = Math.sin(gameTime * 0.01) * 3;
    const catchBump = daya.isCatching ? -6 : 0;
    const bodyY = catchBump + garbaStep;

    // 1. Chaniya Choli (Flared Gujarati Skirt)
    const skirtWidth = daya.isSpinning ? 72 : 56;
    const skirtGrad = ctx.createLinearGradient(0, bodyY - 10, 0, bodyY + 45);
    skirtGrad.addColorStop(0, '#be185d'); // Magenta / Deep Pink
    skirtGrad.addColorStop(1, '#9d174d');

    ctx.fillStyle = skirtGrad;
    ctx.beginPath();
    ctx.moveTo(-16, bodyY);
    ctx.quadraticCurveTo(-skirtWidth / 2, bodyY + 26, -skirtWidth / 2 + 6, bodyY + 44);
    ctx.lineTo(skirtWidth / 2 - 6, bodyY + 44);
    ctx.quadraticCurveTo(skirtWidth / 2, bodyY + 26, 16, bodyY);
    ctx.closePath();
    ctx.fill();

    // Mirror work embroidery (Abhla work) dots on skirt
    ctx.fillStyle = '#fef08a';
    for (let r = 0; r < 5; r++) {
      const mx = -skirtWidth / 2 + 10 + r * (skirtWidth / 5);
      const my = bodyY + 36;
      ctx.beginPath();
      ctx.arc(mx, my, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(mx, my, 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
    }

    // Golden Zari hem border
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-skirtWidth / 2 + 6, bodyY + 44);
    ctx.lineTo(skirtWidth / 2 - 6, bodyY + 44);
    ctx.stroke();

    // 2. Choli / Blouse (Traditional Yellow/Orange bandhani with green border)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.roundRect(-16, bodyY - 26, 32, 28, 4);
    ctx.fill();

    // Odhani (Gujarati Dupatta draped diagonally)
    ctx.fillStyle = '#10b981'; // Emerald green
    ctx.beginPath();
    ctx.moveTo(-16, bodyY - 24);
    ctx.lineTo(16, bodyY);
    ctx.lineTo(12, bodyY + 8);
    ctx.lineTo(-16, bodyY - 14);
    ctx.closePath();
    ctx.fill();

    // 3. Daya's Head & Face
    ctx.fillStyle = '#fed7aa'; // Radiant complexion
    ctx.beginPath();
    ctx.arc(0, bodyY - 38, 15, 0, Math.PI * 2);
    ctx.fill();

    // Hair Bun (Ambada) with Jasmine Gajra
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(0, bodyY - 48, 11, 0, Math.PI * 2);
    ctx.fill();

    // White Jasmine flower garland (Gajra) around bun
    ctx.fillStyle = '#f8fafc';
    for (let g = 0; g < 7; g++) {
      const angle = (Math.PI / 6) * g + Math.PI * 0.9;
      const gx = Math.cos(angle) * 12;
      const gy = bodyY - 48 + Math.sin(angle) * 11;
      ctx.beginPath();
      ctx.arc(gx, gy, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Daya's Bindi & Maang Tikka
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(0, bodyY - 42, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Daya's Traditional Gujarati Nose Ring (Nath)
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(5, bodyY - 35, 2.5, 0, Math.PI * 2);
    ctx.stroke();

    // Sparkling Eyes
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-4.5, bodyY - 38, 2, 0, Math.PI * 2);
    ctx.arc(4.5, bodyY - 38, 2, 0, Math.PI * 2);
    ctx.fill();

    // Daya's Signature Radiant Smile ("Aha ha ha!")
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, bodyY - 33, 4.5, 0.1, Math.PI - 0.1);
    ctx.stroke();

    // 4. Arms & Dandiya Sticks
    this.drawDayaArmsAndDandiyas(ctx, bodyY, daya);

    ctx.restore();

    // 5. Dialogue Bubble above Daya
    if (daya.dialogue) {
      this.drawDialogueBubble(dx, dy - 88, daya.dialogue);
    }
  }

  /** Render Daya's animated hands and dandiya sticks */
  private drawDayaArmsAndDandiyas(
    ctx: CanvasRenderingContext2D,
    bodyY: number,
    daya: DayaCharacter
  ): void {
    const isCatch = daya.isCatching;

    // Hand skin tone
    ctx.fillStyle = '#fed7aa';

    // Left Arm & Dandiya
    ctx.save();
    ctx.translate(-14, bodyY - 16);
    ctx.rotate(isCatch ? -0.7 : -0.25 + daya.dandiyaAngleLeft);

    // Arm sleeve
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-4, -2, 8, 12);
    // Forearm
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-3, 8, 6, 14);

    // Colorful Bangles (Choodiyan)
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-3.5, 16, 7, 2);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(-3.5, 18, 7, 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-3.5, 20, 7, 2);

    // Left Dandiya Stick
    ctx.translate(0, 24);
    ctx.rotate(-0.4);
    this.renderDandiyaStick(ctx, '#f97316', '#fef08a', '#dc2626');
    ctx.restore();

    // Right Arm & Dandiya
    ctx.save();
    ctx.translate(14, bodyY - 16);
    ctx.rotate(isCatch ? 0.7 : 0.25 + daya.dandiyaAngleRight);

    // Arm sleeve
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-4, -2, 8, 12);
    // Forearm
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-3, 8, 6, 14);

    // Bangles
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-3.5, 16, 7, 2);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(-3.5, 18, 7, 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-3.5, 20, 7, 2);

    // Right Dandiya Stick
    ctx.translate(0, 24);
    ctx.rotate(0.4);
    this.renderDandiyaStick(ctx, '#3b82f6', '#fef08a', '#1e40af');
    ctx.restore();

    // If catching, draw Dandiya Clack spark explosion right in front of Daya!
    if (isCatch) {
      ctx.save();
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, bodyY + 4, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /** Dialogue bubble popping above Daya ("Hey Maa Mataji!", etc.) */
  private drawDialogueBubble(x: number, y: number, text: string): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.font = 'bold 12px "Rozha One", Outfit, sans-serif';
    const metrics = ctx.measureText(text);
    const bubbleW = metrics.width + 24;
    const bubbleH = 28;

    // Keep within canvas bounds
    const bx = Math.max(bubbleW / 2 + 10, Math.min(CANVAS_WIDTH - bubbleW / 2 - 10, x));

    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.roundRect(bx - bubbleW / 2, y - bubbleH / 2, bubbleW, bubbleH, 10);
    ctx.fill();

    // Pointer notch
    ctx.beginPath();
    ctx.moveTo(bx - 6, y + bubbleH / 2);
    ctx.lineTo(bx, y + bubbleH / 2 + 8);
    ctx.lineTo(bx + 6, y + bubbleH / 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#be185d';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, bx, y);
    ctx.restore();
  }

  // --- 8. FLOATING TEXTS ---
  private drawFloatingTexts(floatingTexts: FloatingText[]): void {
    const ctx = this.ctx;
    for (const ft of floatingTexts) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.font = ft.isSpecial
        ? '900 18px Outfit, sans-serif'
        : 'bold 15px Outfit, sans-serif';
      ctx.fillStyle = ft.color;
      ctx.textAlign = 'center';
      ctx.shadowColor = ft.isSpecial ? '#fbbf24' : 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = ft.isSpecial ? 8 : 4;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }
  }

  // --- 9. FRENZY SCREEN AURA ---
  private drawFrenzyAura(gameTime: number): void {
    const ctx = this.ctx;
    ctx.save();
    // Shimmering golden border
    const pulse = Math.sin(gameTime * 0.01) * 0.3 + 0.7;
    ctx.strokeStyle = `rgba(251, 191, 36, ${0.4 + pulse * 0.4})`;
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, CANVAS_WIDTH - 6, CANVAS_HEIGHT - 6);

    // Festive header banner during frenzy
    ctx.fillStyle = 'rgba(190, 24, 93, 0.85)';
    ctx.beginPath();
    ctx.roundRect(CANVAS_WIDTH / 2 - 130, 8, 260, 26, 13);
    ctx.fill();

    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = '900 12px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚡ SUPER GARBA FRENZY 2X! ⚡', CANVAS_WIDTH / 2, 21);

    ctx.restore();
  }
}
