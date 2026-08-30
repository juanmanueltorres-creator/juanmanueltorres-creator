import {
  Circle,
  Img,
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
import {CONTENT_LEFT, CONTENT_RIGHT} from '../shared/layout';
import {carouselMetadata, getProject} from '../shared/metadata';
import {countMetric} from '../shared/primitives/CountMetric';
import {drawPath} from '../shared/primitives/DrawPath';
import {
  normalizeFocalPosition,
  revealScreenshot,
} from '../shared/primitives/ScreenshotReveal';
import {staggerPoints} from '../shared/primitives/StaggerPoints';
import {interpolatePolyline} from '../shared/route';
import {THEME} from '../shared/theme';

export const FLEETFLOW_ROUTE = [
  [-390, 115],
  [-225, 10],
  [-80, 88],
  [90, -35],
  [245, 42],
  [390, -88],
] as const;

export default makeScene2D(function* (view) {
  const project = getProject(carouselMetadata, 'fleetflow');
  const route = createRef<Line>();
  const vehicle = createRef<Circle>();
  const depot = createRef<Circle>();
  const schematic = createRef<Rect>();
  const screenshotFrame = createRef<Rect>();
  const stopRefs = FLEETFLOW_ROUTE.slice(1, -1).map(() => createRef<Circle>());
  const focal = normalizeFocalPosition(project.imagePosition);
  const delivered = createSignal('0');
  const distance = createSignal('0.0 km');
  const active = createSignal('0/8');

  view.fill(THEME.color.background);
  view.add(
    <>
      <Rect
        width={1024}
        height={1294}
        radius={24}
        stroke={THEME.color.borderSoft}
        lineWidth={2}
      />
      <Txt
        text={project.name}
        left={[CONTENT_LEFT, -570]}
        width={936}
        fill={THEME.color.text}
        fontFamily={THEME.font.display}
        fontSize={48}
        fontWeight={700}
        textAlign={'left'}
      />
      <Txt
        text={project.status}
        right={[CONTENT_RIGHT, -570]}
        width={420}
        fill={THEME.color.accent}
        fontFamily={THEME.font.mono}
        fontSize={15}
        fontWeight={700}
        letterSpacing={1.4}
        textAlign={'right'}
      />

      <Rect ref={schematic} y={0} width={936} height={760}>
        <Txt
          text={'SYNTHETIC OPERATIONS'}
          x={-410}
          y={-305}
          fill={THEME.color.muted2}
          fontFamily={THEME.font.mono}
          fontSize={14}
          fontWeight={700}
          letterSpacing={1.8}
          textAlign={'left'}
        />
        <Line
          ref={route}
          points={FLEETFLOW_ROUTE.map(([x, y]) => [x, y])}
          stroke={THEME.color.accent}
          lineWidth={6}
          radius={20}
          opacity={0.88}
        />
        <Circle
          ref={depot}
          x={FLEETFLOW_ROUTE[0][0]}
          y={FLEETFLOW_ROUTE[0][1]}
          width={40}
          height={40}
          fill={THEME.color.background}
          stroke={THEME.color.accent}
          lineWidth={4}
        />
        <Txt
          text={'DEPOT'}
          x={FLEETFLOW_ROUTE[0][0]}
          y={FLEETFLOW_ROUTE[0][1] + 54}
          fill={THEME.color.muted}
          fontFamily={THEME.font.mono}
          fontSize={15}
          fontWeight={700}
        />
        {FLEETFLOW_ROUTE.slice(1, -1).map(([x, y], index) => (
          <Circle
            ref={stopRefs[index]}
            x={x}
            y={y}
            width={18}
            height={18}
            fill={THEME.color.background}
            stroke={THEME.color.text}
            lineWidth={3}
          />
        ))}
        <Circle
          ref={vehicle}
          x={FLEETFLOW_ROUTE[0][0]}
          y={FLEETFLOW_ROUTE[0][1]}
          width={32}
          height={32}
          fill={THEME.color.text}
          stroke={THEME.color.background}
          lineWidth={5}
        />

        <Rect
          x={0}
          y={280}
          width={880}
          height={120}
          radius={18}
          fill={THEME.color.surfaceRaised}
          stroke={THEME.color.border}
          lineWidth={2}
        >
          <Txt
            text={() => `DELIVERED  ${delivered()}`}
            x={-292}
            fill={THEME.color.text}
            fontFamily={THEME.font.mono}
            fontSize={20}
            fontWeight={700}
          />
          <Txt
            text={() => `DISTANCE  ${distance()}`}
            x={0}
            fill={THEME.color.text}
            fontFamily={THEME.font.mono}
            fontSize={20}
            fontWeight={700}
          />
          <Txt
            text={() => `ACTIVE  ${active()}`}
            x={300}
            fill={THEME.color.text}
            fontFamily={THEME.font.mono}
            fontSize={20}
            fontWeight={700}
          />
        </Rect>
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
        text={'ROUTES · STOPS · PACKAGES · FLEET KPIs'}
        y={THEME.space.captionY}
        fill={THEME.color.muted}
        fontFamily={THEME.font.mono}
        fontSize={16}
        fontWeight={700}
        letterSpacing={0.8}
      />
    </>,
  );

  route().end(0);
  depot().opacity(0);
  vehicle().opacity(0);
  for (const stop of stopRefs) {
    stop().opacity(0);
    stop().scale(0);
  }

  yield* depot().opacity(1, 0.14);
  yield* all(
    drawPath(route(), 0.4),
    staggerPoints(stopRefs.map(ref => ref()), 0.055, 4),
  );
  yield* vehicle().opacity(1, 0.1);
  yield* all(
    tween(0.66, progress => {
      const point = interpolatePolyline(FLEETFLOW_ROUTE, progress);
      vehicle().position([point.x, point.y]);
    }),
    countMetric(delivered, 0, 100, 0.66),
    countMetric(distance, 0, 84.7, 0.66, {decimals: 1, suffix: ' km'}),
    countMetric(active, 0, 8, 0.66, {suffix: '/8'}),
  );
  yield* all(
    schematic().opacity(0.05, 0.32),
    schematic().scale(0.98, 0.32),
    revealScreenshot(screenshotFrame(), 0.36, 1.018),
  );
  yield* waitFor(0.88);
});
