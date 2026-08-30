import {makeScene2D, Txt} from '@motion-canvas/2d';
import {waitFor} from '@motion-canvas/core';
import {carouselMetadata} from '../shared/metadata';

export default makeScene2D(function* (view) {
  view.fill('#090807');
  view.add(
    <Txt
      text={carouselMetadata.cover.title}
      fill={'#f3e8d4'}
      fontFamily={'Georgia, serif'}
      fontSize={64}
      width={900}
      textWrap
      textAlign={'left'}
    />,
  );
  yield* waitFor(1);
});
