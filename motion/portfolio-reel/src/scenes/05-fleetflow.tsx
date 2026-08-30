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
import {carouselMetadata, getProject} from '../shared/metadata';
import {countMetric} from '../shared/primitives/CountMetric';
import {drawPath} from '../shared/primitives/DrawPath';
import {
  normalizeFocalPosition,
  revealScreenshot,
} from '../shared/primitives/ScreenshotReveal';
import {interpolatePolyline} from '../shared/route';
import {THEME} from '../shared/theme';

export const FLEETFLOW_ROUTE = [
  [-380, 120],
  [-220, 20],
  [-80, 90],
  [90, -30],
  [240, 45],
  [380, -80],
] as const;

export default makeScene2D(function* (view) {
  const project = getProject(carouselMetadata, 'fleetflow');
  const route = createRef<Line>();
  const vehicle = createRef<Circle>();
  const depot = createRef<Circle>();
  const schematic = createRef<Rect>();
  const screenshotFrame = createRef<Rect>();
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

      <Rect ref={schematic} y={10} width={936} height={760}>
        <Txt
          text={'SYNTHETIC OPERATIONS'}
          x={-410}
          y={-310}
          fill={THEME.color.muted2}
          fontFamily={THEME.font.mono}
          fontSize={14}
          fontWeight={700}
          letterSpacing={1.8}
          textAlign={'left'}
        />
        <Line
          ref={route}
          points={FLEETFLOW_ROUTE}
          stroke={THEME.color.accent}
          lineWidth={5}
          radius={18}
          opacity={0.82}
        />
        <Circle
          ref={depot}
          x={FLEETFLOW_ROUTE[0][0]}
          y={FLEETFLOW_ROUTE[0][1]}
          width={32}
          height={32}
          fill={THEME.color.background}
          stroke={THEME.color.accent}
          lineWidth={4}
        />
        <Txt
          text={'DEPOT'}
          x={FLEETFLOW_ROUTE[0][0]}
          y={FLEETFLOW_ROUTE[0][1] + 48}
          fill={THEME.color.muted}
          fontFamily={THEME.font.mono}
          fontSize={15}
          fontWeight={700}
        />
        <Circle
          ref={vehicle}
          x={FLEETFLOW_ROUTE[0][0]}
          y={FLEETFLOW_ROUTE[0][1]}
          width={22}
          height={22}
          fill={THEME.color.text}
          stroke={THEME.color.background}
          lineWidth={4}
        />

        <Rect
          x={0}
          y={280}
          width={860}
          height={126}
          radius={18}
          fill={THEME.color.surface}
          stroke={THEME.color.border}
          lineWidth={2}
        >
          <Txt
            text={() => `DELIVERED  ${delivered()}`}
            x={-280}
            fill={THEME.color.text}
            fontFamily={THEME.font.mono}
            fontSize={19}
            fontWeight={700}
          />
          <Txt
            text={() => `DISTANCE  ${distance()}`}
            x={0}
            fill={THEME.color.text}
            fontFamily={THEME.font.mono}
            fontSize={19}
            fontWeight={700}
          />
          <Txt
            text={() => `ACTIVE  ${active()}`}
            x={290}
            fill={THEME.color.text}
            fontFamily={THEME.font.mono}
            fontSize={19}
            fontWeight={700}
          />
        </Rect>
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
        text={'Routes · scheduled stops · packages · fleet KPIs'}
        y={390}
        fill={THEME.color.muted}
        fontFamily={THEME.font.mono}
        fontSize={17}
        letterSpacing={0.8}
      />
    </>,
  );

  route().end(0);
  depot().opacity(0);
  vehicle().opacity(0);

  yield* depot().opacity(1, 0.18);
  yield* drawPath(route(), 0.48);
  yield* vehicle().opacity(1, 0.12);
  yield* tween(0.72, progress => {
    const point = interpolatePolyline(FLEETFLOW_ROUTE, progress);
    vehicle().position([point.x, point.y]);
  });
  yield* all(
    countMetric(delivered, 0, 100, 0.46),
    countMetric(distance, 0, 84.7, 0.46, {decimals: 1, suffix: ' km'}),
    countMetric(active, 0, 8, 0.46, {suffix: '/8'}),
  );
  yield* schematic().opacity(0, 0.22);
  yield* revealScreenshot(screenshotFrame(), 0.42, 1.025);
  yield* waitFor(0.5);
});
