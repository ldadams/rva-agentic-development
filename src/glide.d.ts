declare module '@glidejs/glide' {
  interface GlideOptions {
    type?: 'slider' | 'carousel';
    startAt?: number;
    perView?: number;
    gap?: number;
    keyboard?: boolean;
    animationDuration?: number;
    swipeThreshold?: number;
    dragThreshold?: number;
  }

  class Glide {
    constructor(selector: string | HTMLElement, options?: GlideOptions);
    mount(): this;
    destroy(): void;
    on(events: string | string[], callback: () => void): this;
    index: number;
  }

  export = Glide;
}
