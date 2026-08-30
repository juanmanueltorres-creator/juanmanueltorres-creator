import {describe, expect, it} from 'vitest';
import {SCENE_IDS} from '../sceneRegistry';

describe('SCENE_IDS', () => {
  it('contains the V1 scenes in publication order', () => {
    expect(SCENE_IDS).toEqual([
      'cover',
      'geoplatform',
      'pulso',
      'anti-ia',
      'fleetflow',
      'atlas',
      'more-systems',
    ]);
  });
});
