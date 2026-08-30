import {Circle, Layout, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {EditorialHeader} from '../shared/components/EditorialHeader';
import {ScreenshotSurface} from '../shared/components/ScreenshotSurface';
import {carouselMetadata, getProject} from '../shared/metadata';
import {MOTION} from '../shared/motion';
import {drawPath} from '../shared/primitives/DrawPath';
import {revealText} from '../shared/primitives/RevealText';
import {revealScreenshot} from '../shared/primitives/ScreenshotReveal';
import {THEME} from '../shared/theme';

export default makeScene2D(function* (view) {
  const project = getProject(carouselMetadata, 'anti-ia');
  const evidenceRail = createRef<Layout>();
  const screenshotFrame = createRef<Rect>();
  const coordinate = createRef<Txt>();
  const notKnowledge = createRef<Txt>();
  const thesis = createRef<Txt>();
  const dataToEvidence = createRef<Line>();
  const evidenceToQuestion = createRef<Line>();
  const contextRail = createRef<Layout>();

  view.fill(THEME.color.canvas);
  view.add(
    <>
      <Layout y={-535}>
        <EditorialHeader
          eyebrow={'04 / EVIDENCE-FIRST INTERFACE'}
          name={project.name}
          status={project.status}
        />
      </Layout>

      <Layout
        layout
        width={THEME.space.contentWidth}
        height={52}
        y={-388}
        gap={16}
        alignItems={'center'}
      >
        <Circle
          width={11}
          height={11}
          fill={THEME.color.accent}
        />
        <Txt
          ref={coordinate}
          text={'COORDINATE'}
          fill={THEME.color.text}
          fontFamily={THEME.font.mono}
          fontSize={19}
          fontWeight={500}
          letterSpacing={0.65}
          opacity={0}
        />
        <Txt
          ref={notKnowledge}
          text={'≠ KNOWLEDGE'}
          fill={THEME.color.accent}
          fontFamily={THEME.font.mono}
          fontSize={19}
          fontWeight={500}
          letterSpacing={0.65}
          opacity={0}
        />
      </Layout>

      <Layout
        ref={evidenceRail}
        layout
        width={THEME.space.contentWidth}
        height={76}
        y={-300}
        alignItems={'center'}
        justifyContent={'space-between'}
        opacity={0}
      >
        <Layout layout width={188} direction={'column'} gap={4} alignItems={'start'}>
          <Txt
            text={'DATA'}
            fill={THEME.color.muted}
            fontFamily={THEME.font.mono}
            fontSize={15}
            fontWeight={500}
            letterSpacing={0.45}
          />
          <Txt
            text={'OBSERVED INPUT'}
            fill={THEME.color.muted2}
            fontFamily={THEME.font.mono}
            fontSize={11}
            fontWeight={400}
            letterSpacing={0.3}
          />
        </Layout>

        <Line
          ref={dataToEvidence}
          points={[[0, 0], [132, 0]]}
          stroke={THEME.color.border}
          lineWidth={1.5}
          endArrow
        />

        <Layout layout width={188} direction={'column'} gap={4} alignItems={'start'}>
          <Txt
            text={'EVIDENCE'}
            fill={THEME.color.accent}
            fontFamily={THEME.font.mono}
            fontSize={15}
            fontWeight={600}
            letterSpacing={0.45}
          />
          <Txt
            text={'SOURCE + METHOD'}
            fill={THEME.color.muted2}
            fontFamily={THEME.font.mono}
            fontSize={11}
            fontWeight={400}
            letterSpacing={0.3}
          />
        </Layout>

        <Line
          ref={evidenceToQuestion}
          points={[[0, 0], [132, 0]]}
          stroke={THEME.color.border}
          lineWidth={1.5}
          endArrow
        />

        <Layout layout width={188} direction={'column'} gap={4} alignItems={'start'}>
          <Txt
            text={'QUESTION'}
            fill={THEME.color.muted}
            fontFamily={THEME.font.mono}
            fontSize={15}
            fontWeight={500}
            letterSpacing={0.45}
          />
          <Txt
            text={'NEXT UNKNOWN'}
            fill={THEME.color.muted2}
            fontFamily={THEME.font.mono}
            fontSize={11}
            fontWeight={400}
            letterSpacing={0.3}
          />
        </Layout>
      </Layout>

      <Txt
        ref={thesis}
        text={'Una coordenada no es un punto.'}
        x={-278}
        y={-215}
        fill={THEME.color.text}
        fontFamily={THEME.font.sans}
        fontSize={23}
        fontWeight={500}
        opacity={0}
      />

      <Rect
        width={THEME.space.screenshotWidth}
        height={THEME.space.screenshotHeight}
        y={105}
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
        height={68}
        y={432}
        alignItems={'center'}
        justifyContent={'space-between'}
        opacity={0}
      >
        <Layout layout direction={'column'} gap={4} alignItems={'start'}>
          <Txt
            text={'EVIDENCE BEFORE CONCLUSION'}
            fill={THEME.color.text}
            fontFamily={THEME.font.sans}
            fontSize={19}
            fontWeight={500}
          />
          <Txt
            text={'KNOWN · MISSING · SUPPORT · NEXT QUESTION'}
            fill={THEME.color.muted2}
            fontFamily={THEME.font.mono}
            fontSize={12}
            fontWeight={500}
            letterSpacing={0.35}
          />
        </Layout>
        <Txt
          text={'EVIDENCE-FIRST'}
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
          text={'COORDINATE · EVIDENCE · QUESTION'}
          fill={THEME.color.muted2}
          fontFamily={THEME.font.mono}
          fontSize={13}
          fontWeight={400}
          letterSpacing={0.35}
        />
        <Txt
          text={'04 / 07'}
          fill={THEME.color.accentSoft}
          fontFamily={THEME.font.mono}
          fontSize={13}
          fontWeight={500}
        />
      </Layout>
    </>,
  );

  dataToEvidence().end(0);
  evidenceToQuestion().end(0);

  yield* sequence(
    0.08,
    revealText(coordinate(), MOTION.component, 8),
    revealText(notKnowledge(), MOTION.component, 8),
  );
  yield* evidenceRail().opacity(1, MOTION.component, MOTION.easing.enter);
  yield* all(
    drawPath(dataToEvidence(), MOTION.micro),
    drawPath(evidenceToQuestion(), MOTION.component),
  );
  yield* revealText(thesis(), MOTION.component, 8);
  yield* revealScreenshot(screenshotFrame(), MOTION.component, 1.02);
  yield* contextRail().opacity(1, MOTION.component, MOTION.easing.enter);
  yield* waitFor(1.02);
});
