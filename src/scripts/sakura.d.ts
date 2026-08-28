export interface SakuraOptions {
  density?: 'dense' | 'sparse';
  windStrength?: number;
}

export const SakuraFX: {
  animating: boolean;
  init(canvas: HTMLCanvasElement, options?: SakuraOptions): void;
  stop(): void;
  setWindStrength(strength?: number): void;
};
