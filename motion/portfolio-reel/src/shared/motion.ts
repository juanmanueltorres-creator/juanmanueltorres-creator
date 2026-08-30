import {easeInOutCubic, easeOutCubic, linear} from '@motion-canvas/core';

export const MOTION = Object.freeze({
  micro: 0.12,
  component: 0.32,
  scene: 0.52,
  easing: {
    enter: easeOutCubic,
    continuity: easeInOutCubic,
    progress: linear,
  },
});
