import {Circle, Layout, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {EditorialHeader} from '../shared/components/EditorialHeader';
import {ScreenshotSurface} from '../shared/components/ScreenshotSurface';
import {carouselMetadata, getProject} from '../shared/metadata';
import {MOTION} from '../shared/motion';
import {revealText} from '../shared/primitives/RevealText';
import {revealScreenshot} from '../shared/primitives/ScreenshotReveal';
import {THEME} from '../shared/theme';

const PROJECT_POINTS = [
  [-352, 24],
  [-238, -34],
  [-116, 38],
  [8, -22],
  [138, 28],
  [258, -42],
  [356, 18],
] as const;

const DIMENSIONS = ['PROVINCE', 'MINERAL', 'STAGE', 'COMPANY', 'CAPITAL'] as const;

export default makeScene2D(function* (view) {
  const project = getProject(carouselMetadata, 'atlas');
  const filterRow = createRef<Layout>();
  const fieldMeta = createRef<Layout>();
  const fieldAxis = createRef<Line>();
  const screenshotFrame = createRef<Rect>();
  const contextRail = createRef<Layout>();
  const pointRefs = PROJECT_POINTS.map(() => createRef<Circle>());
  const labelRefs = DIMENSIONS.map(() => createRef<Txt>());

  view.fill(THEME.color.canvas);
  view.add(
    <>
      <Layout y={-535}>
        <EditorialHeader
          eyebrow={'06 / MINING ATLAS'}
          name={project.name}
          status={project.status}
        />
      </Layout>

      <Layout
        ref={filterRow}
        layout
        width={THEME.space.contentWidth}
        height={42}
        y={-398}
        alignItems={'center'}
        justifyContent={'space-between'}
        opacity={0}
      >
        {DIMENSIONS.map((label, index) => (
          <Txt
            ref={labelRefs[index]}
            text={label}
            fill={index === DIMENSIONS.length - 1 ? THEME.color.accent : THEME.color.muted}
            fontFamily={THEME.font.mono}
            fontSize={13}
            fontWeight={index === DIMENSIONS.length - 1 ? 600 : 500}
            letterSpacing={0.42}
          />
        ))}
      </Layout>

      <Layout
        ref={fieldMeta}
        layout
        width={THEME.space.contentWidth}
        height={24}
        y={-337}
        alignItems={'center'}
        justifyContent={'space-between'}
        opacity={0}
      >
        <Txt
          text={'ABSTRACT PROJECT FIELD / ARGENTINA'}
          fill={THEME.color.muted2}
          fontFamily={THEME.font.mono}
          fontSize={11}
          fontWeight={500}
          letterSpacing={0.35}
        />
        <Txt
          text={'CAPITAL · SELECTED'}
          fill={THEME.color.accentSoft}
          fontFamily={THEME.font.mono}
          fontSize={11}
          fontWeight={500}
          letterSpacing={0.35}
        />
      </Layout>

      <Layout width={THEME.space.contentWidth} height={130} y={-270}>
        <Line
          ref={fieldAxis}
          points={[[-390, 0], [390, 0]]}
          stroke={THEME.color.borderSoft}
          lineWidth={1.5}
          opacity={0.9}
        />
        {PROJECT_POINTS.map(([x, y], index) => (
          <Circle
            ref={pointRefs[index]}
            x={x}
            y={y}
            width={index === 5 ? 18 : 10}
            height={index === 5 ? 18 : 10}
            fill={index === 5 ? '#00000000' : THEME.color.canvas}
            stroke={index === 5 ? THEME.color.accent : THEME.color.muted}
            lineWidth={index === 5 ? 2 : 1.5}
            opacity={0}
          />
        ))}
      </Layout>

      <Rect
        width={THEME.space.screenshotWidth}
        height={THEME.space.screenshotHeight}
        y={115}
      >
        <ScreenshotSurface
          screenshot={project.screenshot}
          imagePosition={project.imagePosition}
          imageWidthPadding={110}
          frameRef={screenshotFrame}
        />
      </Rect>

      <Layout
        ref={contextRail}
        layout
        width={THEME.space.contentWidth}
        height={64}
        y={442}
        alignItems={'center'}
        justifyContent={'space-between'}
        opacity={0}
      >
        <Layout layout direction={'column'} gap={4} alignItems={'start'}>
          <Txt
            text={'ARGENTINE MINING PROJECTS'}
            fill={THEME.color.text}
            fontFamily={THEME.font.sans}
            fontSize={19}
            fontWeight={500}
          />
          <Txt
            text={'PROVINCE · MINERAL · STAGE · COMPANY · CAPITAL'}
            fill={THEME.color.muted2}
            fontFamily={THEME.font.mono}
            fontSize={12}
            fontWeight={500}
            letterSpacing={0.35}
          />
        </Layout>
        <Txt
          text={'FILTER / EXPLORE'}
          fill={THEME.color.accentSoft}
          fontFamily={THEME.font.mono}
          fontSize={12}
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
          text={'PROJECT · FILTER · CONTEXT'}
          fill={THEME.color.muted2}
          fontFamily={THEME.font.mono}
          fontSize={13}
          fontWeight={400}
          letterSpacing={0.35}
        />
        <Txt
          text={'06 / 07'}
          fill={THEME.color.accentSoft}
          fontFamily={THEME.font.mono}
          fontSize={13}
          fontWeight={500}
        />
      </Layout>
    </>,
  );

  for (const pointRef of pointRefs) {
    pointRef().scale(0.94);
  }

  yield* all(
    filterRow().opacity(1, MOTION.component, MOTION.easing.enter),
    fieldMeta().opacity(1, MOTION.component, MOTION.easing.enter),
  );
  yield* sequence(
    0.04,
    ...labelRefs.map(label => revealText(label(), MOTION.micro, 6)),
  );
  yield* all(
    ...pointRefs.map(pointRef =>
      all(
        pointRef().opacity(0.78, MOTION.component, MOTION.easing.enter),
        pointRef().scale(1, MOTION.component, MOTION.easing.enter),
      ),
    ),
  );
  yield* all(
    pointRefs[5]().scale(1.22, MOTION.micro, MOTION.easing.enter),
    revealScreenshot(screenshotFrame(), MOTION.component, 1.02),
  );
  yield* pointRefs[5]().scale(1, MOTION.micro, MOTION.easing.continuity);
  yield* contextRail().opacity(1, MOTION.component, MOTION.easing.enter);
  yield* waitFor(0.86);
});
