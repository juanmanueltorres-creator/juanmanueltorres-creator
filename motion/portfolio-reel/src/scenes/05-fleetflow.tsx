import {
  Circle,
  Img,
  Layout,
  Line,
  makeScene2D,
  Rect,
  Txt,
} from '@motion-canvas/2d';
import {
  all,
  createRef,
  createSignal,
  tween,
  waitFor,
} from '@motion-canvas/core';
import {ASSET_URLS} from '../shared/assets';
import {EnterpriseFrame} from '../shared/components/EnterpriseFrame';
import {MetricPanel} from '../shared/components/MetricPanel';
import {SurfacePanel} from '../shared/components/SurfacePanel';
import {carouselMetadata, getProject} from '../shared/metadata';
import {MOTION} from '../shared/motion';
import {countMetric} from '../shared/primitives/CountMetric';
import {
  applyRouteTrail,
} from '../shared/primitives/RouteTrail';
import {
  normalizeFocalPosition,
  revealScreenshot,
} from '../shared/primitives/ScreenshotReveal';
import {staggerPoints} from '../shared/primitives/StaggerPoints';
import {interpolatePolyline} from '../shared/route';
import {THEME} from '../shared/theme';

export const FLEETFLOW_ROUTE = [
  [-390, 58],
  [-225, -38],
  [-80, 36],
  [90, -66],
  [245, 8],
  [390, -92],
] as const;

export default makeScene2D(function* (view) {
  const project = getProject(carouselMetadata, 'fleetflow');
  const operations = createRef<Rect>();
  const route = createRef<Line>();
  const trail = createRef<Line>();
  const vehicle = createRef<Circle>();
  const depot = createRef<Circle>();
  const screenshotFrame = createRef<Rect>();
  const metrics = createRef<Layout>();
  const stopRefs = FLEETFLOW_ROUTE.slice(1, -1).map(() => createRef<Circle>());
  const focal = normalizeFocalPosition(project.imagePosition);
  const delivered = createSignal('0');
  const distance = createSignal('0.0 km');
  const active = createSignal('0/8');

  view.fill(THEME.color.canvas);
  view.add(
    <EnterpriseFrame
      eyebrow={'05 / FLEET OPERATIONS'}
      name={project.name}
      status={project.status}
      footer={'ROUTES · STOPS · PACKAGES · FLEET KPIs'}
    >
      <Layout
        layout
        width={936}
        height={920}
        direction={'column'}
        gap={18}
        alignItems={'center'}
      >
        <SurfacePanel
          ref={operations}
          width={936}
          height={226}
          level={'raised'}
        >
          <Layout
            layout
            width={880}
            height={188}
            direction={'column'}
            gap={10}
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
                text={'OPERATIONAL RUN / CÓRDOBA'}
                fill={THEME.color.muted}
                fontFamily={THEME.font.mono}
                fontSize={13}
                fontWeight={600}
                letterSpacing={1.1}
              />
              <Txt
                text={'ROUTE 01 · ACTIVE'}
                fill={THEME.color.accent}
                fontFamily={THEME.font.mono}
                fontSize={12}
                fontWeight={600}
                letterSpacing={0.8}
              />
            </Layout>

            <Rect width={880} height={150}>
              <Line
                points={FLEETFLOW_ROUTE.map(([x, y]) => [x, y])}
                stroke={THEME.color.border}
                lineWidth={7}
                radius={18}
                opacity={0.7}
              />
              <Line
                ref={route}
                points={FLEETFLOW_ROUTE.map(([x, y]) => [x, y])}
                stroke={THEME.color.accentSoft}
                lineWidth={4}
                radius={18}
              />
              <Line
                ref={trail}
                points={FLEETFLOW_ROUTE.map(([x, y]) => [x, y])}
                stroke={THEME.color.accent}
                lineWidth={8}
                radius={18}
                opacity={0.34}
              />

              <Circle
                ref={depot}
                x={FLEETFLOW_ROUTE[0][0]}
                y={FLEETFLOW_ROUTE[0][1]}
                width={28}
                height={28}
                fill={THEME.color.workspace}
                stroke={THEME.color.accent}
                lineWidth={3}
              />
              {FLEETFLOW_ROUTE.slice(1, -1).map(([x, y], index) => (
                <Circle
                  ref={stopRefs[index]}
                  x={x}
                  y={y}
                  width={14}
                  height={14}
                  fill={THEME.color.workspace}
                  stroke={THEME.color.text}
                  lineWidth={2}
                />
              ))}
              <Circle
                ref={vehicle}
                x={FLEETFLOW_ROUTE[0][0]}
                y={FLEETFLOW_ROUTE[0][1]}
                width={24}
                height={24}
                fill={THEME.color.text}
                stroke={THEME.color.canvas}
                lineWidth={4}
              />
            </Rect>
          </Layout>
        </SurfacePanel>

        <Layout
          ref={metrics}
          layout
          width={936}
          height={78}
          gap={12}
          alignItems={'center'}
          opacity={0}
        >
          <MetricPanel
            label={'DELIVERED'}
            value={() => delivered()}
            width={304}
          />
          <MetricPanel
            label={'DISTANCE'}
            value={() => distance()}
            icon={'gauge'}
            width={304}
          />
          <MetricPanel
            label={'ACTIVE'}
            value={() => active()}
            width={304}
          />
        </Layout>

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

  route().end(0);
  trail().start(0);
  trail().end(0);
  depot().opacity(0);
  vehicle().opacity(0);
  for (const stop of stopRefs) {
    stop().opacity(0);
    stop().scale(0);
  }

  yield* all(
    depot().opacity(1, MOTION.micro, MOTION.easing.enter),
    metrics().opacity(1, MOTION.component, MOTION.easing.enter),
    staggerPoints(stopRefs.map(ref => ref()), 0.045, 4),
  );
  yield* vehicle().opacity(1, MOTION.micro, MOTION.easing.enter);

  yield* all(
    tween(0.72, progress => {
      const operationalProgress = MOTION.easing.progress(progress);
      const point = interpolatePolyline(FLEETFLOW_ROUTE, operationalProgress);
      route().end(operationalProgress);
      applyRouteTrail(trail(), operationalProgress, 0.24);
      vehicle().position([point.x, point.y]);
    }),
    countMetric(delivered, 0, 100, 0.72),
    countMetric(distance, 0, 84.7, 0.72, {decimals: 1, suffix: ' km'}),
    countMetric(active, 0, 8, 0.72, {suffix: '/8'}),
  );

  yield* all(
    operations().opacity(0.68, MOTION.component, MOTION.easing.continuity),
    metrics().opacity(0.82, MOTION.component, MOTION.easing.continuity),
    revealScreenshot(screenshotFrame(), MOTION.component, 1.02),
  );
  yield* waitFor(0.94);
});
