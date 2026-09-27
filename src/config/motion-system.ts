export const motionSystem = {
  durations: { micro: 150, fast: 200, normal: 300, slow: 450, hero: 850 },
  easings: { standard: 'cubic-bezier(.22,1,.36,1)', exit: 'cubic-bezier(.4,0,1,1)' },
  patterns: {
    buttonPress: { duration: 150, usage: 'All actionable buttons', reducedMotion: 'opacity only' },
    iconHover: { duration: 180, usage: 'Arrows, search and icon buttons', reducedMotion: 'disabled' },
    pageTransition: { duration: 350, usage: 'Route surface entrance', reducedMotion: 'instant' },
    toastEnter: { duration: 260, usage: 'Feedback notifications', reducedMotion: 'opacity only' },
    modalEnter: { duration: 300, usage: 'Confirmation dialogs', reducedMotion: 'opacity only' },
    stagger: { duration: 70, usage: 'Product grids and navigation', reducedMotion: 'disabled' }
  }
} as const;
