export const SCENE_IDS = [
  'cover',
  'geoplatform',
  'pulso',
  'anti-ia',
  'fleetflow',
  'atlas',
  'more-systems',
] as const;

export type SceneId = (typeof SCENE_IDS)[number];
