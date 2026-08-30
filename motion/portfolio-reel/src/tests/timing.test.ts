import {describe, expect, it} from 'vitest';
import {totalDurationSeconds} from '../shared/timing';

describe('scene timing', () => {
  it('keeps V1 inside the 18-24 second target', () => {
    expect(totalDurationSeconds()).toBeGreaterThanOrEqual(18);
    expect(totalDurationSeconds()).toBeLessThanOrEqual(24);
  });
});
