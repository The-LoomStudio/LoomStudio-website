export interface CloudFieldOptions {
  density?: number;
  motionScale?: number;
}

export class CloudField {
  private readonly viewport: HTMLElement;
  private readonly world: HTMLElement;
  private readonly density: number;
  private readonly motionScale: number;
  private readonly bases: HTMLElement[] = [];
  private readonly layers: HTMLElement[] = [];
  private animationFrameId = 0;
  private elapsed = 0;
  private lastFrameTime = 0;
  private paused = false;
  private started = false;

  constructor(viewport: HTMLElement, options: CloudFieldOptions = {}) {
    this.viewport = viewport;
    this.density = options.density ?? 1.35;
    this.motionScale = options.motionScale ?? 0.52;
    this.world = document.createElement('div');
    this.world.className = 'sky-cloud-world';
    this.viewport.append(this.world);
  }

  start() {
    if (this.started) return;
    this.generate();
    this.started = true;
    if (!this.paused) this.animationFrameId = window.requestAnimationFrame(this.updateLoop);
  }

  destroy() {
    window.cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = 0;
    this.started = false;
    this.bases.length = 0;
    this.layers.length = 0;
    this.world.remove();
  }

  setPaused(paused: boolean) {
    if (this.paused === paused) return;
    this.paused = paused;
    this.lastFrameTime = 0;
    if (paused) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    } else if (this.started) {
      this.animationFrameId = window.requestAnimationFrame(this.updateLoop);
    }
  }

  setAtmosphere(filter: string, opacity: number) {
    for (const layer of this.layers) layer.style.filter = filter;
    this.viewport.style.opacity = String(opacity);
  }

  private generate() {
    const baseCount = this.density >= 3 ? 8 : 10;
    const cloudCount = Math.min(36, Math.max(6, Math.floor(baseCount * this.density)));

    for (let index = 0; index < cloudCount; index += 1) {
      this.createCloud(index);
    }
  }

  private createCloud(index: number) {
    const base = document.createElement('div');
    base.className = 'sky-cloud-base';

    const x = 900 - Math.random() * 1800;
    const y = 420 - Math.random() * 840;
    const z = 320 - Math.random() * 640;
    const drift = 0.8 + Math.random() * 1.6;
    const bobPhase = Math.random() * Math.PI * 2;
    const bobAmount = 1 + Math.random() * 2.5;

    base.dataset.baseX = String(x);
    base.dataset.baseY = String(y);
    base.dataset.baseZ = String(z);
    base.dataset.drift = String(drift);
    base.dataset.bobPhase = String(bobPhase);
    base.dataset.bobAmount = String(bobAmount);
    base.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;

    this.world.append(base);
    this.bases.push(base);

    const layerCount = this.density >= 3 ? 2 + Math.round(Math.random()) : 3 + Math.round(Math.random() * 2);
    for (let layerIndex = 0; layerIndex < layerCount; layerIndex += 1) {
      const cloud = document.createElement('div');
      cloud.className = 'sky-cloud-layer';
      cloud.style.opacity = String(0.6 + Math.random() * 0.4);

      const layerX = (256 - Math.random() * 512) * 0.2;
      const layerY = (256 - Math.random() * 512) * 0.2;
      const layerZ = 100 - Math.random() * 200;
      const angle = Math.random() * 360;
      const scale = 0.5 + Math.random();

      cloud.style.transform = `translate3d(${layerX}px, ${layerY}px, ${layerZ}px) rotateZ(${angle}deg) scale(${scale})`;

      base.append(cloud);
      this.layers.push(cloud);
    }

    base.dataset.index = String(index);
  }

  private updateLoop = (now: number) => {
    this.animationFrameId = 0;
    if (this.paused || !this.started) return;
    const deltaSeconds = this.lastFrameTime ? Math.min((now - this.lastFrameTime) / 1000, 0.05) : 0;
    this.lastFrameTime = now;
    this.elapsed += deltaSeconds;
    const horizontalSpeed = 5 * 0.55 * this.motionScale;

    for (const base of this.bases) {
      const baseX = Number(base.dataset.baseX) || 0;
      const baseY = Number(base.dataset.baseY) || 0;
      const baseZ = Number(base.dataset.baseZ) || 0;
      const drift = Number(base.dataset.drift) || 0;
      const bobPhase = Number(base.dataset.bobPhase) || 0;
      const bobAmount = Number(base.dataset.bobAmount) || 0;

      let x = baseX + this.elapsed * drift * horizontalSpeed;
      while (x > 980) x -= 1960;
      const y = baseY + Math.sin(this.elapsed * 0.05 + bobPhase) * bobAmount * 0.7;
      base.style.transform = `translate3d(${x}px, ${y}px, ${baseZ}px)`;
    }

    this.animationFrameId = window.requestAnimationFrame(this.updateLoop);
  };
}
