import {Circle, Img, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {createRef, sequence, waitFor} from '@motion-canvas/core';
import {ASSET_URLS} from '../shared/assets';
import {carouselMetadata, getProject} from '../shared/metadata';
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
  const screenshotFrame = createRef<Rect>();
  const coordinate = createRef<Txt>();
  const notKnowledge = createRef<Txt>();
  const data = createRef<Txt>();
  const evidence = createRef<Txt>();
  const question = createRef<Txt>();
  const thesis = createRef<Txt>();
  const dataToEvidence = createRef<Line>();
  const evidenceToQuestion = createRef<Line>();
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

      <Rect ref={concept} y={-10} width={936} height={800}>
        <Circle
          x={-330}
          y={-220}
          width={20}
          height={20}
          fill={THEME.color.accent}
        />
        <Txt
          ref={coordinate}
          text={'COORDINATE'}
          x={-185}
          y={-220}
          fill={THEME.color.text}
          fontFamily={THEME.font.mono}
          fontSize={22}
          fontWeight={700}
          letterSpacing={1.8}
          opacity={0}
        />
        <Txt
          ref={notKnowledge}
          text={'≠  KNOWLEDGE'}
          x={245}
          y={-220}
          fill={THEME.color.accent}
          fontFamily={THEME.font.mono}
          fontSize={22}
          fontWeight={700}
          letterSpacing={1.8}
          opacity={0}
        />

        <Txt
          ref={data}
          text={'DATA'}
          x={-290}
          y={70}
          fill={THEME.color.text}
          fontFamily={THEME.font.mono}
          fontSize={22}
          fontWeight={700}
          opacity={0}
        />
        <Txt
          ref={evidence}
          text={'EVIDENCE'}
          x={0}
          y={70}
          fill={THEME.color.text}
          fontFamily={THEME.font.mono}
          fontSize={22}
          fontWeight={700}
          opacity={0}
        />
        <Txt
          ref={question}
          text={'QUESTION'}
          x={300}
          y={70}
          fill={THEME.color.text}
          fontFamily={THEME.font.mono}
          fontSize={22}
          fontWeight={700}
          opacity={0}
        />
        <Line
          ref={dataToEvidence}
          points={[[-220, 70], [-95, 70]]}
          stroke={THEME.color.border}
          lineWidth={3}
          endArrow
        />
        <Line
          ref={evidenceToQuestion}
          points={[[105, 70], [210, 70]]}
          stroke={THEME.color.border}
          lineWidth={3}
          endArrow
        />

        <Txt
          ref={thesis}
          text={'Una coordenada no es un punto.'}
          y={300}
          width={850}
          fill={THEME.color.muted}
          fontFamily={THEME.font.display}
          fontSize={42}
          fontStyle={'italic'}
          textAlign={'center'}
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
        text={'Questions · evidence · context · what is still missing'}
        y={390}
        fill={THEME.color.muted}
        fontFamily={THEME.font.mono}
        fontSize={17}
      />
    </>,
  );

  dataToEvidence().end(0);
  evidenceToQuestion().end(0);

  yield* revealText(coordinate(), 0.3, 10);
  yield* revealText(notKnowledge(), 0.34, 10);
  yield* sequence(
    0.09,
    revealText(data(), 0.26, 10),
    revealText(evidence(), 0.26, 10),
    revealText(question(), 0.26, 10),
  );
  yield* sequence(
    0.08,
    drawPath(dataToEvidence(), 0.25),
    drawPath(evidenceToQuestion(), 0.25),
  );
  yield* revealText(thesis(), 0.36, 12);
  yield* waitFor(0.24);
  yield* concept().opacity(0, 0.22);
  yield* revealScreenshot(screenshotFrame(), 0.44, 1.02);
  yield* waitFor(0.5);
});
