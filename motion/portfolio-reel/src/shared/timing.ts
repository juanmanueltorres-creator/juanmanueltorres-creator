import type {SceneId} from '../sceneRegistry';

export const SCENE_DURATION_SECONDS: Readonly<Record<SceneId, number>> = {
  cover: 2.7,
  geoplatform: 2.7,
  pulso: 2.7,
  'anti-ia': 3.2,
  fleetflow: 3.3,
  atlas: 2.7,
  'more-systems': 2.7,
};

export function totalDurationSeconds(): number {
  return Object.values(SCENE_DURATION_SECONDS).reduce((sum, value) => sum + value, 0);
}
