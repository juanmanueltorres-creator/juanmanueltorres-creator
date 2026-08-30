export const PROJECT_IDS = [
  'geoplatform',
  'pulso',
  'anti-ia',
  'fleetflow',
  'atlas',
] as const;

export type ProjectId = (typeof PROJECT_IDS)[number];
export type ImageFit = 'slice' | 'meet';
export type ImagePosition = 'center' | 'top' | 'bottom' | 'left' | 'right';
export type MotionMotif =
  | 'default'
  | 'scan'
  | 'signals'
  | 'evidence'
  | 'route'
  | 'atlas';

export interface MotionOptions {
  motif: MotionMotif;
  durationSeconds?: number;
  focus?: string;
}

export interface CoverMetadata {
  eyebrow: string;
  title: string;
  subtitle: string;
  footer: string;
}

export interface ProjectSlide {
  id: ProjectId;
  name: string;
  description: string;
  status: string;
  stack: string[];
  screenshot: string;
  imageFit: ImageFit;
  imagePosition: ImagePosition;
  liveUrl?: string;
  repoUrl?: string;
  motion: MotionOptions;
}

export interface MoreSystem {
  name: string;
  description: string;
  stack: string[];
  repoUrl?: string;
}

export interface CarouselMetadata {
  cover: CoverMetadata;
  projects: ProjectSlide[];
  moreSystems: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: MoreSystem[];
  };
}
