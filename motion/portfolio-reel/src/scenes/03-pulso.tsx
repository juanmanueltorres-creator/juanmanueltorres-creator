import {Circle, Img, Layout, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {ASSET_URLS} from '../shared/assets';
import {EnterpriseFrame} from '../shared/components/EnterpriseFrame';
import {StatusChip} from '../shared/components/StatusChip';
import {SurfacePanel} from '../shared/components/SurfacePanel';
import {carouselMetadata, getProject} from '../shared/metadata';
import {MOTION} from '../shared/motion';
import {
  normalizeFocalPosition,
  revealScreenshot,
} from '../shared/primitives/ScreenshotReveal';
import {staggerPoints} from '../shared/primitives/StaggerPoints';
import {THEME} from '../shared/theme';

const SIGNAL_POINTS = [
  [-336, -56], [-238, 34], [-126, -72], [-8, 16],
  [116, -58], [226, 40], [322, -20], [72, 76],
] as const;

export default makeScene2D(function* (view) {
  const project = getProject(carouselMetadata, 'pulso');
  const stateRow = createRef<Layout>();
  const field = createRef<Rect>();
  const screenshotFrame = createRef<Rect>();
  const pointRefs = SIGNAL_POINTS.map(() => createRef<Circle>());
  const focal = normalizeFocalPosition(project.imagePosition);

  view.fill(THEME.color.canvas);
  view.add(
    <EnterpriseFrame
      eyebrow={'03 / PUBLIC TERRITORIAL SIGNALS'}
      name={project.name}
      status={project.status}
      footer={'EARTHQUAKES · THERMAL · WEATHER · SOURCE · FRESHNESS'}
    >
      <Layout
        layout
        width={936}
        height={920}
        direction={'column'}
        gap={18}
        alignItems={'center'}
      >
        <Layout
          ref={stateRow}
          layout
          width={936}
          height={42}
          gap={8}
          alignItems={'center'}
          opacity={0}
        >
          <StatusChip label={'SIGNAL'} icon={'activity'} active />
          <StatusChip label={'SOURCE'} icon={'database'} active />
          <StatusChip label={'FRESHNESS'} icon={'gauge'} />
        </Layout>

        <SurfacePanel
          ref={field}
          width={936}
          height={210}
          level={'raised'}
        >
          <Layout
            layout
            width={880}
            height={172}
            direction={'column'}
            gap={12}
            alignItems={'start'}
          >
            <Layout
              layout
              width={880}
              height={28}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Txt
                text={'PUBLIC SIGNAL FIELD / ARGENTINA'}
                fill={THEME.color.muted}
                fontFamily={THEME.font.mono}
                fontSize={13}
                fontWeight={600}
                letterSpacing={1.1}
              />
              <Txt
                text={'PROVENANCE ON'}
                fill={THEME.color.accent}
                fontFamily={THEME.font.mono}
                fontSize={12}
                fontWeight={600}
                letterSpacing={0.8}
              />
            </Layout>
            <Rect width={880} height={128}>
              {SIGNAL_POINTS.map(([x, y], index) => {
                const ring = index % 3 === 0;
                return (
                  <Circle
                    ref={pointRefs[index]}
                    x={x}
                    y={y}
                    width={ring ? 22 : 12 + (index % 2) * 4}
                    height={ring ? 22 : 12 + (index % 2) * 4}
                    fill={ring ? '#00000000' : THEME.color.text}
                    stroke={ring ? THEME.color.accent : THEME.color.border}
                    lineWidth={ring ? 2 : 1}
                    opacity={0}
                  />
                );
              })}
            </Rect>
          </Layout>
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
            width={THEME.space.screenshotWidth + 120}
            x={focal.x * 44}
            y={focal.y * 34}
          />
        </Rect>
      </Layout>
    </EnterpriseFrame>,
  );

  yield* staggerPoints(pointRefs.map(ref => ref()), 0.035, 14);
  yield* all(
    stateRow().opacity(1, MOTION.component, MOTION.easing.enter),
    pointRefs[3]().scale(1.35, MOTION.micro, MOTION.easing.enter),
  );
  yield* pointRefs[3]().scale(1, MOTION.micro, MOTION.easing.continuity);
  yield* all(
    field().opacity(0.58, MOTION.component, MOTION.easing.continuity),
    revealScreenshot(screenshotFrame(), MOTION.component, 1.02),
  );
  yield* waitFor(1.02);
});
