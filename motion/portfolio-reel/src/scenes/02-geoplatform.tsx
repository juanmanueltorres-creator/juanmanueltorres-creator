import {Circle, Img, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {createRef, sequence, waitFor} from '@motion-canvas/core';
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
  ['MINING', -290, -175],
  ['SATELLITE', -20, -285],
  ['WEATHER', 275, -180],
  ['SEISMIC', -250, 150],
  ['ROUTES', 260, 145],
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

      <Rect ref={context} y={10} width={936} height={760}>
        <Line points={[[-70, 0], [70, 0]]} stroke={THEME.color.border} lineWidth={2} />
        <Line points={[[0, -70], [0, 70]]} stroke={THEME.color.border} lineWidth={2} />
        <Circle width={16} height={16} fill={THEME.color.accent} />
        <Circle
          ref={pulse}
          width={12}
          height={12}
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
            fontSize={19}
            fontWeight={700}
            letterSpacing={1.8}
            opacity={0}
          />
        ))}
        <Txt
          text={'ONE PLACE → MULTIPLE CONTEXT LAYERS'}
          y={290}
          fill={THEME.color.muted2}
          fontFamily={THEME.font.mono}
          fontSize={15}
          fontWeight={700}
          letterSpacing={1.4}
        />
      </Rect>

      <Rect
        ref={screenshotFrame}
        y={40}
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
          width={THEME.space.screenshotWidth + 80}
          x={focal.x * 36}
          y={focal.y * 28}
        />
      </Rect>
      <Txt
        text={'Mining · satellite · weather · seismic · routes'}
        y={390}
        fill={THEME.color.muted}
        fontFamily={THEME.font.mono}
        fontSize={17}
      />
    </>,
  );

  yield* scanPulse(pulse(), 0.48, 210);
  yield* sequence(
    0.05,
    ...labels.map(label => revealText(label(), 0.2, 10)),
  );
  yield* waitFor(0.18);
  yield* context().opacity(0, 0.22);
  yield* revealScreenshot(screenshotFrame(), 0.42, 1.025);
  yield* waitFor(0.62);
});
