import {describe, expect, it} from 'vitest';
import canonical from '../../../../portfolio/social_carousel.json';
import {getProject, validateCarouselMetadata} from '../shared/metadata';

const assets = {
  'assets/geoplatform-preview.png': 'geoplatform-url',
  'assets/pulso_territorial.png': 'pulso-url',
  'assets/anti-ia-preview.png': 'anti-url',
  'assets/fleetflowsim.png': 'fleet-url',
  'assets/atlasgeotech.png': 'atlas-url',
} as const;

describe('validateCarouselMetadata', () => {
  it('accepts the checked-in canonical carousel', () => {
    const result = validateCarouselMetadata(canonical, assets);
    expect(result.projects.map(project => project.id)).toEqual([
      'geoplatform',
      'pulso',
      'anti-ia',
      'fleetflow',
      'atlas',
    ]);
  });

  it('rejects a screenshot path that is not in the explicit asset registry', () => {
    const broken = structuredClone(canonical);
    broken.projects[0].screenshot = 'assets/missing.png';
    expect(() => validateCarouselMetadata(broken, assets)).toThrow(
      "project 'geoplatform' references unregistered screenshot 'assets/missing.png'",
    );
  });

  it('rejects duplicate project ids', () => {
    const broken = structuredClone(canonical);
    broken.projects[1].id = 'geoplatform';
    expect(() => validateCarouselMetadata(broken, assets)).toThrow(
      "duplicate project id 'geoplatform'",
    );
  });

  it('uses deterministic motion defaults when motion metadata is absent', () => {
    const result = validateCarouselMetadata(canonical, assets);
    expect(getProject(result, 'fleetflow').motion).toEqual({
      motif: 'default',
      durationSeconds: undefined,
      focus: undefined,
    });
  });
});
