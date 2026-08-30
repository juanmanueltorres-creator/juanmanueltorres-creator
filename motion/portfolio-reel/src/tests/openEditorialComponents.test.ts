import {describe, expect, it} from 'vitest';
import headerSource from '../shared/components/EditorialHeader.tsx?raw';
import screenshotSource from '../shared/components/ScreenshotSurface.tsx?raw';
import labelSource from '../shared/components/TechnicalLabel.tsx?raw';
import metricSource from '../shared/components/MetricReadout.tsx?raw';
import {THEME} from '../shared/theme';

describe('open technical editorial components', () => {
  it('defines open-canvas spacing and product elevation', () => {
    expect(THEME.space.edgeMin).toBeGreaterThanOrEqual(64);
    expect(THEME.space.localVisualMin).toBeGreaterThanOrEqual(56);
    expect(THEME.space.screenshotRadius).toBe(18);
    expect(THEME.shadow.product).toEqual({
      color: '#00000057',
      blur: 70,
      offset: [0, 28],
    });
  });

  it('keeps the header unboxed and wrap-safe', () => {
    expect(headerSource).toContain('<Layout');
    expect(headerSource).not.toContain('<Rect');
    expect(headerSource).not.toContain('textWrap');
    expect(headerSource).toContain('THEME.font.sans');
    expect(headerSource).toContain('THEME.font.mono');
  });

  it('elevates only the screenshot surface', () => {
    expect(screenshotSource).toContain('THEME.space.screenshotRadius');
    expect(screenshotSource).toContain('shadowColor={THEME.shadow.product.color}');
    expect(screenshotSource).toContain('shadowBlur={THEME.shadow.product.blur}');
    expect(screenshotSource).toContain('shadowOffset={THEME.shadow.product.offset}');
    expect(screenshotSource).not.toContain('stroke={THEME.color.accent}');
  });

  it('keeps labels and metrics container-free', () => {
    expect(labelSource).not.toContain('<Rect');
    expect(metricSource).not.toContain('SurfacePanel');
  });
});
