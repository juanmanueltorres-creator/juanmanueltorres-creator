import rawMetadata from '../../../../portfolio/social_carousel.json';
import {ASSET_URLS} from './assets';
import {
  PROJECT_IDS,
  type CarouselMetadata,
  type ImageFit,
  type ImagePosition,
  type MotionMotif,
  type MotionOptions,
  type ProjectId,
  type ProjectSlide,
} from './types';

const IMAGE_FITS = new Set<ImageFit>(['slice', 'meet']);
const IMAGE_POSITIONS = new Set<ImagePosition>([
  'center',
  'top',
  'bottom',
  'left',
  'right',
]);
const MOTION_MOTIFS = new Set<MotionMotif>([
  'default',
  'scan',
  'signals',
  'evidence',
  'route',
  'atlas',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireRecord(value: unknown, field: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(`'${field}' must be an object`);
  }
  return value;
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`'${field}' must be a non-empty string`);
  }
  return value.trim();
}

function optionalString(value: unknown, field: string): string | undefined {
  if (value === undefined || value === null) return undefined;
  return requireString(value, field);
}

function requireStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`'${field}' must be a non-empty string array`);
  }
  return value.map((item, index) => requireString(item, `${field}[${index}]`));
}

function parseProjectId(value: unknown): ProjectId {
  const id = requireString(value, 'project.id');
  if (!PROJECT_IDS.includes(id as ProjectId)) {
    throw new Error(`unknown project id '${id}'`);
  }
  return id as ProjectId;
}

function parseImageFit(value: unknown): ImageFit {
  if (value === undefined) return 'slice';
  const fit = requireString(value, 'project.image_fit') as ImageFit;
  if (!IMAGE_FITS.has(fit)) {
    throw new Error(`unsupported image_fit '${fit}'`);
  }
  return fit;
}

function parseImagePosition(value: unknown): ImagePosition {
  if (value === undefined) return 'center';
  const position = requireString(value, 'project.image_position') as ImagePosition;
  if (!IMAGE_POSITIONS.has(position)) {
    throw new Error(`unsupported image_position '${position}'`);
  }
  return position;
}

function parseMotion(value: unknown, projectId: ProjectId): MotionOptions {
  if (value === undefined || value === null) {
    return {motif: 'default', durationSeconds: undefined, focus: undefined};
  }

  const motion = requireRecord(value, `project '${projectId}'.motion`);
  const motifRaw = motion.motif ?? 'default';
  const motif = requireString(motifRaw, `project '${projectId}'.motion.motif`) as MotionMotif;
  if (!MOTION_MOTIFS.has(motif)) {
    throw new Error(`project '${projectId}' has unsupported motion motif '${motif}'`);
  }

  let durationSeconds: number | undefined;
  if (motion.duration_seconds !== undefined) {
    if (
      typeof motion.duration_seconds !== 'number' ||
      !Number.isFinite(motion.duration_seconds) ||
      motion.duration_seconds <= 0
    ) {
      throw new Error(
        `project '${projectId}'.motion.duration_seconds must be a finite number > 0`,
      );
    }
    durationSeconds = motion.duration_seconds;
  }

  return {
    motif,
    durationSeconds,
    focus: optionalString(motion.focus, `project '${projectId}'.motion.focus`),
  };
}

export function validateCarouselMetadata(
  input: unknown,
  assets: Readonly<Record<string, string>>,
): CarouselMetadata {
  const root = requireRecord(input, 'metadata');
  const coverRaw = requireRecord(root.cover, 'cover');
  const projectsRaw = root.projects;
  const moreSystemsRaw = requireRecord(root.more_systems, 'more_systems');

  if (!Array.isArray(projectsRaw) || projectsRaw.length !== PROJECT_IDS.length) {
    throw new Error(`'projects' must contain exactly ${PROJECT_IDS.length} entries`);
  }

  const seen = new Set<ProjectId>();
  const projects: ProjectSlide[] = projectsRaw.map((value, index) => {
    const raw = requireRecord(value, `projects[${index}]`);
    const id = parseProjectId(raw.id);
    if (seen.has(id)) {
      throw new Error(`duplicate project id '${id}'`);
    }
    seen.add(id);

    const screenshot = requireString(raw.screenshot, `project '${id}'.screenshot`);
    if (!(screenshot in assets)) {
      throw new Error(
        `project '${id}' references unregistered screenshot '${screenshot}'`,
      );
    }

    return {
      id,
      name: requireString(raw.name, `project '${id}'.name`),
      description: requireString(raw.description, `project '${id}'.description`),
      status: requireString(raw.status, `project '${id}'.status`),
      stack: requireStringArray(raw.stack, `project '${id}'.stack`),
      screenshot,
      imageFit: parseImageFit(raw.image_fit),
      imagePosition: parseImagePosition(raw.image_position),
      liveUrl: optionalString(raw.live_url, `project '${id}'.live_url`),
      repoUrl: optionalString(raw.repo_url, `project '${id}'.repo_url`),
      motion: parseMotion(raw.motion, id),
    };
  });

  for (const id of PROJECT_IDS) {
    if (!seen.has(id)) {
      throw new Error(`missing project id '${id}'`);
    }
  }

  const itemsRaw = moreSystemsRaw.items;
  if (!Array.isArray(itemsRaw) || itemsRaw.length !== 4) {
    throw new Error(`'more_systems.items' must contain exactly 4 entries`);
  }

  return {
    cover: {
      eyebrow: requireString(coverRaw.eyebrow, 'cover.eyebrow'),
      title: requireString(coverRaw.title, 'cover.title'),
      subtitle: requireString(coverRaw.subtitle, 'cover.subtitle'),
      footer: requireString(coverRaw.footer, 'cover.footer'),
    },
    projects,
    moreSystems: {
      eyebrow: requireString(moreSystemsRaw.eyebrow, 'more_systems.eyebrow'),
      title: requireString(moreSystemsRaw.title, 'more_systems.title'),
      subtitle: requireString(moreSystemsRaw.subtitle, 'more_systems.subtitle'),
      items: itemsRaw.map((value, index) => {
        const item = requireRecord(value, `more_systems.items[${index}]`);
        return {
          name: requireString(item.name, `more_systems.items[${index}].name`),
          description: requireString(
            item.description,
            `more_systems.items[${index}].description`,
          ),
          stack: requireStringArray(
            item.stack,
            `more_systems.items[${index}].stack`,
          ),
          repoUrl: optionalString(
            item.repo_url,
            `more_systems.items[${index}].repo_url`,
          ),
        };
      }),
    },
  };
}

export function getProject(
  metadata: CarouselMetadata,
  id: ProjectId,
): ProjectSlide {
  const project = metadata.projects.find(candidate => candidate.id === id);
  if (!project) {
    throw new Error(`project '${id}' not found`);
  }
  return project;
}

export const carouselMetadata = validateCarouselMetadata(rawMetadata, ASSET_URLS);
