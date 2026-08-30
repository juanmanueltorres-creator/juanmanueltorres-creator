import {Circle, Img, Layout, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {ASSET_URLS} from '../shared/assets';
import {EnterpriseFrame} from '../shared/components/EnterpriseFrame';
import {StatusChip} from '../shared/components/StatusChip';
import {SurfacePanel} from '../shared/components/SurfacePanel';
import {carouselMetadata, getProject} from '../shared/metadata';
import {MOTION} from '../shared/motion';
import {scanPulse} from '../shared/primitives/ScanPulse';
import {
  normalizeFocalPosition,
  revealScreenshot,
} from '../shared/primitives/ScreenshotReveal';
import {THEME} from '../shared/theme';

export default makeScene2D(function* (view) {
  const project = getProject(carouselMetadata, 'geoplatform');
  const chipRow = createRef<Layout>();
  const screenshotFrame = createRef<Rect>();
  const pulse = createRef<Circle>();
  const contextRail = createRef<Rect>();
  const focal = normalizeFocalPosition(project.imagePosition);

  view.fill(THEME.color.canvas);
  view.add(
    <EnterpriseFrame
      eyebrow={'02 / TERRITORIAL INTELLIGENCE'}
      name={project.name}
      status={project.status}
      footer={'MINING · SATELLITE · WEATHER · SEISMIC · ROUTES'}
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
          ref={chipRow}
          layout
          width={936}
          height={42}
          gap={8}
          alignItems={'center'}
        >
          <StatusChip label={'MINING'} icon={'database'} active />
          <StatusChip label={'SATELLITE'} icon={'satellite'} active />
          <StatusChip label={'WEATHER'} />
          <StatusChip label={'SEISMIC'} icon={'activity'} />
          <StatusChip label={'ROUTES'} icon={'route'} />
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
          <Line
            points={[[-292, -78], [-218, -78]]}
            stroke={THEME.color.accentSoft}
            lineWidth={1}
            opacity={0.7}
          />
          <Line
            points={[[-255, -115], [-255, -41]]}
            stroke={THEME.color.accentSoft}
            lineWidth={1}
            opacity={0.7}
          />
          <Circle
            ref={pulse}
            x={-255}
            y={-78}
            width={12}
            height={12}
            stroke={THEME.color.accent}
            lineWidth={2}
            fill={'#00000000'}
          />
        </Rect>

        <SurfacePanel
          ref={contextRail}
          layout
          width={936}
          height={88}
          padding={[16, 20]}
          alignItems={'center'}
          justifyContent={'space-between'}
          opacity={0}
        >
          <Layout layout direction={'column'} gap={4} alignItems={'start'}>
            <Txt
              text={'LIVE TERRITORIAL CONTEXT'}
              fill={THEME.color.text}
              fontFamily={THEME.font.sans}
              fontSize={18}
              fontWeight={600}
            />
            <Txt
              text={'ONE PLACE / MULTIPLE VERIFIED CONTEXT LAYERS'}
              fill={THEME.color.muted2}
              fontFamily={THEME.font.mono}
              fontSize={12}
              fontWeight={500}
              letterSpacing={0.8}
            />
          </Layout>
          <Txt
            text={'05 DOMAINS'}
            fill={THEME.color.accent}
            fontFamily={THEME.font.mono}
            fontSize={14}
            fontWeight={600}
          />
        </SurfacePanel>
      </Layout>
    </EnterpriseFrame>,
  );

  chipRow().opacity(0);
  contextRail().opacity(0);

  yield* chipRow().opacity(1, MOTION.component, MOTION.easing.enter);
  yield* all(
    revealScreenshot(screenshotFrame(), MOTION.component, 1.02),
    scanPulse(pulse(), MOTION.component, 120),
  );
  yield* contextRail().opacity(1, MOTION.component, MOTION.easing.enter);
  yield* waitFor(1.18);
});
