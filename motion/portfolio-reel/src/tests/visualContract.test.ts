import {describe, expect, it} from 'vitest';
import {THEME} from '../shared/theme';

describe('motion reel visual contract', () => {
  it('uses the portrait social canvas contract', () => {
    expect(THEME.canvas).toEqual({width: 1080, height: 1350, fps: 25});
  });

  it('makes the product screenshot the dominant visual', () => {
    expect(THEME.space.screenshotWidth).toBe(THEME.space.contentWidth);
    expect(THEME.space.screenshotHeight).toBeGreaterThanOrEqual(550);
    expect(THEME.space.screenshotY).toBe(35);
    expect(THEME.space.captionY).toBeGreaterThan(
      THEME.space.screenshotY + THEME.space.screenshotHeight / 2 + 40,
    );
  });
});
