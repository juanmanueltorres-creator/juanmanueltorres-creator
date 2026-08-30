import {Circle, Img, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {createRef, sequence, waitFor} from '@motion-canvas/core';
import {ASSET_URLS} from '../shared/assets';
import {carouselMetadata, getProject} from '../shared/metadata';
import {revealText} from '../shared/primitives/RevealText';
import {
  normalizeFocalPosition,
  revealScreenshot,
} from '../shared/primitives/ScreenshotReveal';
import {staggerPoints} from '../shared/primitives/StaggerPoints';
import {THEME} from '../shared/theme';

const SIGNAL_POINTS = [
  [-360, -180], [-240, -90], [-120, -210], [15, -120], [155, -215], [325, -120],
  [-300, 70], [-165, 135], [-20, 45], [125, 120], [260, 35], [360, 145],
] as const;

export default makeScene2D(function* (view) {
  const project = getProject(carouselMetadata, 'pulso');
  const field = createRef<Rect>();
  const screenshotFrame = createRef<Rect>();
  const pointRefs = SIGNAL_POINTS.map(() => createRef<Circle>());
  const signal = createRef<Txt>();
  const source = createRef<Txt>();
  const freshness = createRef<Txt>();
  const focal = normalizeFocalPosition(project.imagePosition);

  view.fill(THEME.color.background);
  view.add(
    <>
      <Rect width={1024} height={1294} radius={24} stroke={THEME.color.borderSoft} lineWidth={2} />
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

      <Rect ref={field} y={0} width={936} height={760}>
        <Rect
          width={860}
          height={500}
          radius={28}
          stroke={THEME.color.border}
          lineWidth={2}
          fill={THEME.color.surface}
          opacity={0.72}
        />
        {SIGNAL_POINTS.map(([x, y], index) => (
          <Circle
            ref={pointRefs[index]}
            x={x}
            y={y}
            width={16 + (index % 3) * 4}
            height={16 + (index % 3) * 4}
            fill={index % 4 === 0 ? THEME.color.accent : THEME.color.text}
            opacity={0}
          />
        ))}

        <Txt
          ref={signal}
          text={'SIGNAL'}
          x={-280}
          y={300}
          fill={THEME.color.text}
          fontFamily={THEME.font.mono}
          fontSize={20}
          fontWeight={700}
          letterSpacing={1.8}
          opacity={0}
        />
        <Line points={[[-190, 300], [-95, 300]]} stroke={THEME.color.border} lineWidth={3} endArrow />
        <Txt
          ref={source}
          text={'SOURCE'}
          x={0}
          y={300}
          fill={THEME.color.text}
          fontFamily={THEME.font.mono}
          fontSize={20}
          fontWeight={700}
          letterSpacing={1.8}
          opacity={0}
        />
        <Line points={[[90, 300], [185, 300]]} stroke={THEME.color.border} lineWidth={3} endArrow />
        <Txt
          ref={freshness}
          text={'FRESHNESS'}
          x={300}
          y={300}
          fill={THEME.color.accent}
          fontFamily={THEME.font.mono}
          fontSize={20}
          fontWeight={700}
          letterSpacing={1.8}
          opacity={0}
        />
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
        text={'Public signals with visible source and update time'}
        y={390}
        fill={THEME.color.muted}
        fontFamily={THEME.font.mono}
        fontSize={17}
      />
    </>,
  );

  yield* staggerPoints(pointRefs.map(ref => ref()), 0.045, 16);
  yield* sequence(
    0.08,
    revealText(signal(), 0.2, 10),
    revealText(source(), 0.2, 10),
    revealText(freshness(), 0.2, 10),
  );
  yield* waitFor(0.2);
  yield* field().opacity(0, 0.2);
  yield* revealScreenshot(screenshotFrame(), 0.42, 1.025);
  yield* waitFor(0.55);
});
