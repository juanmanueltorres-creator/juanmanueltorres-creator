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

const PROJECT_POINTS = [
  [-310, -190], [-170, -245], [15, -170], [205, -230], [335, -120],
  [-250, 20], [-70, 75], [110, 5], [285, 80],
] as const;

const DIMENSIONS = ['PROVINCE', 'MINERAL', 'STAGE', 'COMPANY', 'CAPITAL'] as const;

export default makeScene2D(function* (view) {
  const project = getProject(carouselMetadata, 'atlas');
  const field = createRef<Rect>();
  const screenshotFrame = createRef<Rect>();
  const pointRefs = PROJECT_POINTS.map(() => createRef<Circle>());
  const labelRefs = DIMENSIONS.map(() => createRef<Txt>());
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
        width={460}
        fill={THEME.color.accent}
        fontFamily={THEME.font.mono}
        fontSize={15}
        fontWeight={700}
        letterSpacing={1.2}
        textAlign={'right'}
      />

      <Rect ref={field} y={0} width={936} height={760}>
        <Rect
          width={860}
          height={500}
          radius={28}
          fill={THEME.color.surface}
          stroke={THEME.color.border}
          lineWidth={2}
          opacity={0.74}
        />
        {[-240, -120, 0, 120, 240].map(x => (
          <Line
            points={[[x, -250], [x, 250]]}
            stroke={THEME.color.borderSoft}
            lineWidth={2}
          />
        ))}
        {[-160, -80, 0, 80, 160].map(y => (
          <Line
            points={[[-430, y], [430, y]]}
            stroke={THEME.color.borderSoft}
            lineWidth={2}
          />
        ))}
        <Txt
          text={'ABSTRACT TERRITORIAL FRAME'}
          x={-390}
          y={-205}
          fill={THEME.color.muted2}
          fontFamily={THEME.font.mono}
          fontSize={13}
          fontWeight={700}
          letterSpacing={1.6}
          textAlign={'left'}
        />
        {PROJECT_POINTS.map(([x, y], index) => (
          <Circle
            ref={pointRefs[index]}
            x={x}
            y={y}
            width={14 + (index % 3) * 3}
            height={14 + (index % 3) * 3}
            fill={index % 3 === 0 ? THEME.color.accent : THEME.color.text}
            opacity={0}
          />
        ))}
        {DIMENSIONS.map((label, index) => (
          <Txt
            ref={labelRefs[index]}
            text={label}
            x={-340 + index * 170}
            y={310}
            fill={index === DIMENSIONS.length - 1 ? THEME.color.accent : THEME.color.text}
            fontFamily={THEME.font.mono}
            fontSize={15}
            fontWeight={700}
            letterSpacing={1.2}
            opacity={0}
          />
        ))}
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
        text={'Argentine mining projects · filters · territorial variables'}
        y={390}
        fill={THEME.color.muted}
        fontFamily={THEME.font.mono}
        fontSize={17}
      />
    </>,
  );

  yield* staggerPoints(pointRefs.map(ref => ref()), 0.05, 16);
  yield* sequence(
    0.055,
    ...labelRefs.map(label => revealText(label(), 0.18, 8)),
  );
  yield* waitFor(0.18);
  yield* field().opacity(0, 0.2);
  yield* revealScreenshot(screenshotFrame(), 0.42, 1.025);
  yield* waitFor(0.55);
});
