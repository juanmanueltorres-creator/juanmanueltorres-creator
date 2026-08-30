import {Circle, Layout, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {EditorialHeader} from '../shared/components/EditorialHeader';
import {ScreenshotSurface} from '../shared/components/ScreenshotSurface';
import {TechnicalLabel} from '../shared/components/TechnicalLabel';
import {carouselMetadata, getProject} from '../shared/metadata';
import {MOTION} from '../shared/motion';
import {drawPath} from '../shared/primitives/DrawPath';
import {revealScreenshot} from '../shared/primitives/ScreenshotReveal';
import {THEME} from '../shared/theme';

const SIGNAL_POINTS: [number, number][] = [
  [-350, 10],
  [-118, -12],
  [116, 12],
  [350, -8],
];

const SIGNAL_LABELS = ['SEISMIC', 'THERMAL', 'WEATHER', 'NATIONAL'] as const;

export default makeScene2D(function* (view) {
  const project = getProject(carouselMetadata, 'pulso');
  const stateRow = createRef<Layout>();
  const fieldMeta = createRef<Layout>();
  const signalRail = createRef<Line>();
  const screenshotFrame = createRef<Rect>();
  const contextRail = createRef<Layout>();
  const pointRefs = SIGNAL_POINTS.map(() => createRef<Circle>());

  view.fill(THEME.color.canvas);
  view.add(
    <>
      <Layout y={-535}>
        <EditorialHeader
          eyebrow={'03 / PUBLIC TERRITORIAL SIGNALS'}
          name={project.name}
          status={project.status}
        />
      </Layout>

      <Layout
        ref={stateRow}
        layout
        width={THEME.space.contentWidth}
        height={34}
        y={-405}
        gap={28}
        alignItems={'center'}
        opacity={0}
      >
        <TechnicalLabel text={'SIGNAL'} active />
        <TechnicalLabel text={'SOURCE'} />
        <TechnicalLabel text={'FRESHNESS'} />
      </Layout>

      <Layout
        ref={fieldMeta}
        layout
        width={THEME.space.contentWidth}
        height={24}
        y={-348}
        alignItems={'center'}
        justifyContent={'space-between'}
        opacity={0}
      >
        <Txt
          text={'PUBLIC SIGNAL FIELD / ARGENTINA'}
          fill={THEME.color.muted}
          fontFamily={THEME.font.mono}
          fontSize={12}
          fontWeight={500}
          letterSpacing={0.5}
        />
        <Txt
          text={'SOURCE + UPDATE TIME VISIBLE'}
          fill={THEME.color.accentSoft}
          fontFamily={THEME.font.mono}
          fontSize={12}
          fontWeight={500}
          letterSpacing={0.4}
        />
      </Layout>

      <Rect width={THEME.space.contentWidth} height={92} y={-292}>
        <Line
          ref={signalRail}
          points={SIGNAL_POINTS}
          stroke={THEME.color.border}
          lineWidth={1}
          radius={12}
          opacity={0.7}
        />

        {SIGNAL_POINTS.map(([x, y], index) => (
          <>
            <Line
              points={[[x, y + 8], [x, 34]]}
              stroke={THEME.color.borderSoft}
              lineWidth={1}
              opacity={0.72}
            />
            <Circle
              ref={pointRefs[index]}
              x={x}
              y={y}
              width={index === 1 ? 14 : 10}
              height={index === 1 ? 14 : 10}
              fill={index === 1 ? '#00000000' : THEME.color.canvas}
              stroke={index === 1 ? THEME.color.accent : THEME.color.accentSoft}
              lineWidth={index === 1 ? 2 : 1.5}
              opacity={0}
            />
            <Txt
              text={SIGNAL_LABELS[index]}
              x={x}
              y={52}
              fill={THEME.color.muted2}
              fontFamily={THEME.font.mono}
              fontSize={11}
              fontWeight={500}
              letterSpacing={0.35}
            />
          </>
        ))}
      </Rect>

      <Rect width={THEME.space.screenshotWidth} height={THEME.space.screenshotHeight} y={74}>
        <ScreenshotSurface
          screenshot={project.screenshot}
          imagePosition={project.imagePosition}
          frameRef={screenshotFrame}
        />
      </Rect>

      <Layout
        ref={contextRail}
        layout
        width={THEME.space.contentWidth}
        height={68}
        y={405}
        alignItems={'center'}
        justifyContent={'space-between'}
        opacity={0}
      >
        <Layout layout direction={'column'} gap={4} alignItems={'start'}>
          <Txt
            text={'RECENT PUBLIC SIGNALS'}
            fill={THEME.color.text}
            fontFamily={THEME.font.sans}
            fontSize={19}
            fontWeight={500}
          />
          <Txt
            text={'EARTHQUAKES · THERMAL · WEATHER · NATIONAL INDICATORS'}
            fill={THEME.color.muted2}
            fontFamily={THEME.font.mono}
            fontSize={12}
            fontWeight={500}
            letterSpacing={0.35}
          />
        </Layout>
        <Txt
          text={'PROVENANCE ON'}
          fill={THEME.color.accent}
          fontFamily={THEME.font.mono}
          fontSize={13}
          fontWeight={500}
          letterSpacing={0.35}
        />
      </Layout>

      <Layout
        layout
        width={THEME.space.contentWidth}
        height={28}
        y={565}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Txt
          text={'SIGNAL · SOURCE · FRESHNESS'}
          fill={THEME.color.muted2}
          fontFamily={THEME.font.mono}
          fontSize={13}
          fontWeight={400}
          letterSpacing={0.35}
        />
        <Txt
          text={'03 / 07'}
          fill={THEME.color.accentSoft}
          fontFamily={THEME.font.mono}
          fontSize={13}
          fontWeight={500}
        />
      </Layout>
    </>,
  );

  for (const pointRef of pointRefs) {
    pointRef().opacity(0);
    pointRef().scale(0.92);
  }

  yield* all(
    stateRow().opacity(1, MOTION.component, MOTION.easing.enter),
    fieldMeta().opacity(1, MOTION.component, MOTION.easing.enter),
    drawPath(signalRail(), MOTION.component),
    ...pointRefs.map(pointRef =>
      all(
        pointRef().opacity(0.82, MOTION.component, MOTION.easing.enter),
        pointRef().scale(1, MOTION.component, MOTION.easing.enter),
      ),
    ),
  );
  yield* all(
    pointRefs[1]().scale(1.28, MOTION.micro, MOTION.easing.enter),
    revealScreenshot(screenshotFrame(), MOTION.component, 1.02),
  );
  yield* pointRefs[1]().scale(1, MOTION.micro, MOTION.easing.continuity);
  yield* contextRail().opacity(1, MOTION.component, MOTION.easing.enter);
  yield* waitFor(1.02);
});
