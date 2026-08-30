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

const PROJECT_POINTS = [
  [-320, -24], [-228, 22], [-132, -32], [-28, 12],
  [82, -26], [188, 26], [292, -8], [346, 30],
] as const;

export default makeScene2D(function* (view) {
  const project = getProject(carouselMetadata, 'atlas');
  const filterRow = createRef<Layout>();
  const field = createRef<Rect>();
  const screenshotFrame = createRef<Rect>();
  const pointRefs = PROJECT_POINTS.map(() => createRef<Circle>());
  const focal = normalizeFocalPosition(project.imagePosition);

  view.fill(THEME.color.canvas);
  view.add(
    <EnterpriseFrame
      eyebrow={'06 / MINING INTELLIGENCE'}
      name={project.name}
      status={project.status}
      footer={'ARGENTINE MINING ATLAS · PROJECTS · FILTERS'}
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
          ref={filterRow}
          layout
          width={936}
          height={42}
          gap={8}
          alignItems={'center'}
          opacity={0}
        >
          <StatusChip label={'PROVINCE'} icon={'mapPin'} />
          <StatusChip label={'MINERAL'} icon={'database'} active />
          <StatusChip label={'STAGE'} />
          <StatusChip label={'COMPANY'} />
          <StatusChip label={'CAPITAL'} icon={'gauge'} />
        </Layout>

        <SurfacePanel
          ref={field}
          width={936}
          height={162}
          level={'raised'}
        >
          <Layout
            layout
            width={880}
            height={124}
            direction={'column'}
            gap={10}
            alignItems={'start'}
          >
            <Layout
              layout
              width={880}
              height={26}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Txt
                text={'ABSTRACT TERRITORIAL FRAME / ARGENTINA'}
                fill={THEME.color.muted}
                fontFamily={THEME.font.mono}
                fontSize={13}
                fontWeight={600}
                letterSpacing={1.05}
              />
              <Txt
                text={'MINERAL FILTER · ACTIVE'}
                fill={THEME.color.accent}
                fontFamily={THEME.font.mono}
                fontSize={12}
                fontWeight={600}
                letterSpacing={0.8}
              />
            </Layout>

            <Rect width={880} height={88}>
              {PROJECT_POINTS.map(([x, y], index) => {
                const selected = index === 4;
                const ring = index % 3 === 0;
                return (
                  <Circle
                    ref={pointRefs[index]}
                    x={x}
                    y={y}
                    width={selected ? 22 : ring ? 17 : 11 + (index % 2) * 3}
                    height={selected ? 22 : ring ? 17 : 11 + (index % 2) * 3}
                    fill={selected ? THEME.color.accent : ring ? '#00000000' : THEME.color.text}
                    stroke={selected || ring ? THEME.color.accent : THEME.color.border}
                    lineWidth={selected ? 2 : ring ? 2 : 1}
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
            width={THEME.space.screenshotWidth + 110}
            x={focal.x * 44}
            y={focal.y * 34}
          />
        </Rect>
      </Layout>
    </EnterpriseFrame>,
  );

  yield* all(
    filterRow().opacity(1, MOTION.component, MOTION.easing.enter),
    staggerPoints(pointRefs.map(ref => ref()), 0.04, 14),
  );
  yield* pointRefs[4]().scale(1.32, MOTION.micro, MOTION.easing.enter);
  yield* pointRefs[4]().scale(1, MOTION.micro, MOTION.easing.continuity);
  yield* all(
    field().opacity(0.62, MOTION.component, MOTION.easing.continuity),
    revealScreenshot(screenshotFrame(), MOTION.component, 1.02),
  );
  yield* waitFor(0.98);
});
