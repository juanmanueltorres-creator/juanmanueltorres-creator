import {Circle, Layout, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, createSignal, tween, waitFor} from '@motion-canvas/core';
import {EditorialHeader} from '../shared/components/EditorialHeader';
import {ScreenshotSurface} from '../shared/components/ScreenshotSurface';
import {carouselMetadata, getProject} from '../shared/metadata';
import {MOTION} from '../shared/motion';
import {countMetric} from '../shared/primitives/CountMetric';
import {drawPath} from '../shared/primitives/DrawPath';
import {applyRouteTrail} from '../shared/primitives/RouteTrail';
import {revealScreenshot} from '../shared/primitives/ScreenshotReveal';
import {interpolatePolyline} from '../shared/route';
import {THEME} from '../shared/theme';

export const FLEETFLOW_ROUTE = [
  [-340, 68],
  [-204, -8],
  [-72, 48],
  [76, -30],
  [214, 20],
  [340, -62],
] as const;

export default makeScene2D(function* (view) {
  const project = getProject(carouselMetadata, 'fleetflow');
  const routeBase = createRef<Line>();
  const routeTrail = createRef<Line>();
  const vehicle = createRef<Circle>();
  const depot = createRef<Circle>();
  const routeField = createRef<Layout>();
  const metrics = createRef<Layout>();
  const screenshotFrame = createRef<Rect>();
  const contextRail = createRef<Layout>();
  const stopRefs = FLEETFLOW_ROUTE.slice(1, -1).map(() => createRef<Circle>());
  const delivered = createSignal('0');
  const distance = createSignal('0.0 km');
  const active = createSignal('0/8');

  view.fill(THEME.color.canvas);
  view.add(
    <>
      <Layout y={-535}>
        <EditorialHeader
          eyebrow={'05 / FLEET OPERATIONS'}
          name={project.name}
          status={project.status}
        />
      </Layout>

      <Layout
        layout
        width={THEME.space.contentWidth}
        height={28}
        y={-405}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Txt
          text={'OPERATIONAL RUN / CÓRDOBA'}
          fill={THEME.color.muted}
          fontFamily={THEME.font.mono}
          fontSize={12}
          fontWeight={500}
          letterSpacing={0.45}
        />
        <Txt
          text={'ROUTE 01 · ACTIVE'}
          fill={THEME.color.accent}
          fontFamily={THEME.font.mono}
          fontSize={12}
          fontWeight={500}
          letterSpacing={0.4}
        />
      </Layout>

      <Layout
        ref={routeField}
        width={THEME.space.contentWidth}
        height={190}
        y={-292}
        opacity={1}
      >
        <Line
          ref={routeBase}
          points={FLEETFLOW_ROUTE.map(([x, y]) => [x, y])}
          stroke={THEME.color.border}
          lineWidth={2.5}
          radius={18}
          opacity={0.92}
        />
        <Line
          ref={routeTrail}
          points={FLEETFLOW_ROUTE.map(([x, y]) => [x, y])}
          stroke={THEME.color.accent}
          lineWidth={5}
          radius={18}
          opacity={0.92}
        />

        <Circle
          ref={depot}
          x={FLEETFLOW_ROUTE[0][0]}
          y={FLEETFLOW_ROUTE[0][1]}
          width={22}
          height={22}
          fill={THEME.color.canvas}
          stroke={THEME.color.accent}
          lineWidth={2}
        />
        <Txt
          text={'DEPOT'}
          x={FLEETFLOW_ROUTE[0][0]}
          y={FLEETFLOW_ROUTE[0][1] + 29}
          fill={THEME.color.muted2}
          fontFamily={THEME.font.mono}
          fontSize={10}
          fontWeight={500}
          letterSpacing={0.3}
        />

        {FLEETFLOW_ROUTE.slice(1, -1).map(([x, y], index) => (
          <Circle
            ref={stopRefs[index]}
            x={x}
            y={y}
            width={10}
            height={10}
            fill={THEME.color.canvas}
            stroke={THEME.color.muted}
            lineWidth={1.5}
          />
        ))}

        <Circle
          ref={vehicle}
          x={FLEETFLOW_ROUTE[0][0]}
          y={FLEETFLOW_ROUTE[0][1]}
          width={16}
          height={16}
          fill={THEME.color.text}
          stroke={THEME.color.canvas}
          lineWidth={3}
        />
      </Layout>

      <Layout
        ref={metrics}
        layout
        width={THEME.space.contentWidth}
        height={76}
        y={-155}
        alignItems={'center'}
        justifyContent={'space-between'}
        opacity={0}
      >
        <Layout layout width={250} direction={'column'} gap={3} alignItems={'start'}>
          <Txt
            text={'DELIVERED'}
            fill={THEME.color.muted2}
            fontFamily={THEME.font.mono}
            fontSize={11}
            fontWeight={500}
            letterSpacing={0.4}
          />
          <Txt
            text={() => delivered()}
            fill={THEME.color.text}
            fontFamily={THEME.font.sans}
            fontSize={25}
            fontWeight={600}
          />
        </Layout>

        <Layout layout width={250} direction={'column'} gap={3} alignItems={'start'}>
          <Txt
            text={'DISTANCE'}
            fill={THEME.color.muted2}
            fontFamily={THEME.font.mono}
            fontSize={11}
            fontWeight={500}
            letterSpacing={0.4}
          />
          <Txt
            text={() => distance()}
            fill={THEME.color.text}
            fontFamily={THEME.font.sans}
            fontSize={25}
            fontWeight={600}
          />
        </Layout>

        <Layout layout width={250} direction={'column'} gap={3} alignItems={'start'}>
          <Txt
            text={'ACTIVE'}
            fill={THEME.color.muted2}
            fontFamily={THEME.font.mono}
            fontSize={11}
            fontWeight={500}
            letterSpacing={0.4}
          />
          <Txt
            text={() => active()}
            fill={THEME.color.text}
            fontFamily={THEME.font.sans}
            fontSize={25}
            fontWeight={600}
          />
        </Layout>
      </Layout>

      <Rect
        width={THEME.space.screenshotWidth}
        height={THEME.space.screenshotHeight}
        y={176}
      >
        <ScreenshotSurface
          screenshot={project.screenshot}
          imagePosition={project.imagePosition}
          imageWidthPadding={120}
          frameRef={screenshotFrame}
        />
      </Rect>

      <Layout
        ref={contextRail}
        layout
        width={THEME.space.contentWidth}
        height={60}
        y={492}
        alignItems={'center'}
        justifyContent={'space-between'}
        opacity={0}
      >
        <Txt
          text={'ROUTES · STOPS · PACKAGES · FLEET KPIs'}
          fill={THEME.color.muted2}
          fontFamily={THEME.font.mono}
          fontSize={12}
          fontWeight={500}
          letterSpacing={0.35}
        />
        <Txt
          text={'SIMULATION / LIVE STATE'}
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
          text={'ROUTE · DELIVERY · PERFORMANCE'}
          fill={THEME.color.muted2}
          fontFamily={THEME.font.mono}
          fontSize={13}
          fontWeight={400}
          letterSpacing={0.35}
        />
        <Txt
          text={'05 / 07'}
          fill={THEME.color.accentSoft}
          fontFamily={THEME.font.mono}
          fontSize={13}
          fontWeight={500}
        />
      </Layout>
    </>,
  );

  routeBase().end(0);
  routeTrail().start(0);
  routeTrail().end(0);
  depot().opacity(0);
  vehicle().opacity(0);
  for (const stop of stopRefs) {
    stop().opacity(0);
  }

  yield* all(
    depot().opacity(1, MOTION.micro, MOTION.easing.enter),
    drawPath(routeBase(), MOTION.component),
    ...stopRefs.map(stop => stop().opacity(0.72, MOTION.component, MOTION.easing.enter)),
  );
  yield* metrics().opacity(1, MOTION.component, MOTION.easing.enter);
  yield* vehicle().opacity(1, MOTION.micro, MOTION.easing.enter);
  yield* all(
    tween(0.72, progress => {
      const point = interpolatePolyline(FLEETFLOW_ROUTE, progress);
      vehicle().position([point.x, point.y]);
      applyRouteTrail(routeTrail(), progress, 0.22);
    }),
    countMetric(delivered, 0, 100, 0.72),
    countMetric(distance, 0, 84.7, 0.72, {decimals: 1, suffix: ' km'}),
    countMetric(active, 0, 8, 0.72, {suffix: '/8'}),
  );
  yield* all(
    routeField().opacity(0.36, MOTION.component, MOTION.easing.continuity),
    revealScreenshot(screenshotFrame(), MOTION.component, 1.018),
  );
  yield* contextRail().opacity(1, MOTION.component, MOTION.easing.enter);
  yield* waitFor(0.86);
});
