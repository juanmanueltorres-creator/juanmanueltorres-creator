import {Circle, Img, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {ASSET_URLS} from '../shared/assets';
import {carouselMetadata, getProject} from '../shared/metadata';
import {revealText} from '../shared/primitives/RevealText';
import {scanPulse} from '../shared/primitives/ScanPulse';
import {
  normalizeFocalPosition,
  revealScreenshot,
} from '../shared/primitives/ScreenshotReveal';
import {THEME} from '../shared/theme';

const DOMAIN_LABELS = [
  ['MINING', -315, -185],
  ['SATELLITE', -25, -300],
  ['WEATHER', 300, -190],
  ['SEISMIC', -285, 165],
  ['ROUTES', 285, 160],
] as const;

export default makeScene2D(function* (view) {
  const project = getProject(carouselMetadata, 'geoplatform');
  const context = createRef<Rect>();
  const pulse = createRef<Circle>();
  const screenshotFrame = createRef<Rect>();
  const labels = DOMAIN_LABELS.map(() => createRef<Txt>());
  const focal = normalizeFocalPosition(project.imagePosition);

  view.fill(THEME.color.background);
  view.add(
    <>
      <Rect width={1024} height={1294} radius={24} stroke={THEME.color.borderSoft} lineWidth={2} />
      <Txt
        text={project.name}
        x={-468}
        y={-570}
        width={936}
        fill={THEME.color.text}
        fontFamily={THEME.font.display}
        fontSize={48}
        fontWeight={700}
        textAlign={'left'}
      />
      <Txt
        text={project.status}
        x={468}
        y={-570}
        width={420}
        fill={THEME.color.accent}
        fontFamily={THEME.font.mono}
        fontSize={15}
        fontWeight={700}
        letterSpacing={1.4}
        textAlign={'right'}
      />

      <Rect ref={context} y={-15} width={936} height={760}>
        <Line points={[[-95, 0], [95, 0]]} stroke={THEME.color.border} lineWidth={2} />
        <Line points={[[0, -95], [0, 95]]} stroke={THEME.color.border} lineWidth={2} />
        {DOMAIN_LABELS.map(([, x, y]) => (
          <Line
            points={[[0, 0], [x * 0.72, y * 0.72]]}
            stroke={THEME.color.borderSoft}
            lineWidth={2}
            opacity={0.85}
          />
        ))}
        <Circle width={20} height={20} fill={THEME.color.accent} />
        <Circle
          ref={pulse}
          width={14}
          height={14}
          stroke={THEME.color.accent}
          lineWidth={3}
          fill={'#00000000'}
        />
        {DOMAIN_LABELS.map(([label, x, y], index) => (
          <Txt
            ref={labels[index]}
            text={label}
            x={x}
            y={y}
            fill={THEME.color.text}
            fontFamily={THEME.font.mono}
            fontSize={20}
            fontWeight={700}
            letterSpacing={1.8}
            opacity={0}
          />
        ))}
        <Txt
          text={'ONE PLACE → MULTIPLE CONTEXT LAYERS'}
          y={292}
          fill={THEME.color.muted2}
          fontFamily={THEME.font.mono}
          fontSize={14}
          fontWeight={700}
          letterSpacing={1.4}
        />
      </Rect>

      <Rect
        ref={screenshotFrame}
        y={THEME.space.screenshotY}
        width={THEME.space.screenshotWidth}
        height={THEME.space.screenshotHeight}
        radius={24}
        clip
        fill={THEME.color.surface}
        stroke={THEME.color.border}
        lineWidth={2}
        opacity={0}
      >
        <Img
          src={ASSET_URLS[project.screenshot]}
          width={THEME.space.screenshotWidth + 120}
          x={focal.x * 44}
          y={focal.y * 34}
        />
      </Rect>
      <Txt
        text={'MINING · SATELLITE · WEATHER · SEISMIC · ROUTES'}
        y={THEME.space.captionY}
        fill={THEME.color.muted}
        fontFamily={THEME.font.mono}
        fontSize={16}
        fontWeight={700}
        letterSpacing={0.7}
      />
    </>,
  );

  yield* scanPulse(pulse(), 0.38, 225);
  yield* sequence(
    0.04,
    ...labels.map(label => revealText(label(), 0.18, 8)),
  );
  yield* waitFor(0.1);
  yield* all(
    context().opacity(0.08, 0.34),
    context().scale(0.97, 0.34),
    revealScreenshot(screenshotFrame(), 0.36, 1.018),
  );
  yield* waitFor(0.82);
});
