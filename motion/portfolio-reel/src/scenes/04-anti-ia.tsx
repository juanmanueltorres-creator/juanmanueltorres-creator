import {Circle, Img, Layout, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {ASSET_URLS} from '../shared/assets';
import {EnterpriseFrame} from '../shared/components/EnterpriseFrame';
import {StatusChip} from '../shared/components/StatusChip';
import {SurfacePanel} from '../shared/components/SurfacePanel';
import {carouselMetadata, getProject} from '../shared/metadata';
import {MOTION} from '../shared/motion';
import {drawPath} from '../shared/primitives/DrawPath';
import {revealText} from '../shared/primitives/RevealText';
import {
  normalizeFocalPosition,
  revealScreenshot,
} from '../shared/primitives/ScreenshotReveal';
import {THEME} from '../shared/theme';

export default makeScene2D(function* (view) {
  const project = getProject(carouselMetadata, 'anti-ia');
  const concept = createRef<Rect>();
  const evidenceRail = createRef<Layout>();
  const screenshotFrame = createRef<Rect>();
  const coordinate = createRef<Txt>();
  const notKnowledge = createRef<Txt>();
  const thesis = createRef<Txt>();
  const dataToEvidence = createRef<Line>();
  const evidenceToQuestion = createRef<Line>();
  const focal = normalizeFocalPosition(project.imagePosition);

  view.fill(THEME.color.canvas);
  view.add(
    <EnterpriseFrame
      eyebrow={'04 / EVIDENCE-FIRST INTERFACE'}
      name={project.name}
      status={project.status}
      footer={'COORDINATE · EVIDENCE · QUESTION'}
    >
      <Layout
        layout
        width={936}
        height={920}
        direction={'column'}
        gap={16}
        alignItems={'center'}
      >
        <SurfacePanel
          ref={concept}
          width={936}
          height={176}
          level={'raised'}
        >
          <Layout
            layout
            width={880}
            height={138}
            direction={'column'}
            gap={18}
            alignItems={'start'}
            justifyContent={'center'}
          >
            <Layout layout width={880} height={40} gap={16} alignItems={'center'}>
              <Circle
                width={14}
                height={14}
                fill={THEME.color.accent}
              />
              <Txt
                ref={coordinate}
                text={'COORDINATE'}
                fill={THEME.color.text}
                fontFamily={THEME.font.mono}
                fontSize={22}
                fontWeight={600}
                letterSpacing={1.2}
                opacity={0}
              />
              <Txt
                ref={notKnowledge}
                text={'≠ KNOWLEDGE'}
                fill={THEME.color.accent}
                fontFamily={THEME.font.mono}
                fontSize={22}
                fontWeight={600}
                letterSpacing={1.2}
                opacity={0}
              />
            </Layout>

            <Layout
              ref={evidenceRail}
              layout
              width={880}
              height={42}
              gap={10}
              alignItems={'center'}
              opacity={0}
            >
              <StatusChip label={'DATA'} icon={'database'} />
              <Line
                ref={dataToEvidence}
                points={[[0, 0], [64, 0]]}
                stroke={THEME.color.accentSoft}
                lineWidth={2}
                endArrow
              />
              <StatusChip label={'EVIDENCE'} icon={'fileText'} active />
              <Line
                ref={evidenceToQuestion}
                points={[[0, 0], [64, 0]]}
                stroke={THEME.color.accentSoft}
                lineWidth={2}
                endArrow
              />
              <StatusChip label={'QUESTION'} icon={'network'} />
            </Layout>
          </Layout>
        </SurfacePanel>

        <SurfacePanel
          width={936}
          height={74}
          level={'workspace'}
        >
          <Txt
            ref={thesis}
            text={'Una coordenada no es un punto.'}
            fill={THEME.color.text}
            fontFamily={THEME.font.sans}
            fontSize={24}
            fontWeight={500}
            opacity={0}
          />
        </SurfacePanel>

        <Rect
          ref={screenshotFrame}
          width={THEME.space.screenshotWidth}
          height={THEME.space.screenshotHeight}
          radius={18}
          clip
          fill={THEME.color.raised}
          stroke={THEME.color.border}
          lineWidth={1}
          opacity={0}
        >
          <Img
            src={ASSET_URLS[project.screenshot]}
            width={THEME.space.screenshotWidth + 110}
            x={focal.x * 44}
            y={focal.y * 34}
          />
        </Rect>
      </Layout>
    </EnterpriseFrame>,
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
  yield* all(
    concept().opacity(0.72, MOTION.component, MOTION.easing.continuity),
    revealScreenshot(screenshotFrame(), MOTION.component, 1.02),
  );
  yield* waitFor(1.02);
});
