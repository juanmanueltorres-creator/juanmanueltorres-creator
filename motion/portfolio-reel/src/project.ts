import {makeProject} from '@motion-canvas/core';
import cover from './scenes/01-cover?scene';
import geoplatform from './scenes/02-geoplatform?scene';
import pulso from './scenes/03-pulso?scene';
import antiIa from './scenes/04-anti-ia?scene';
import fleetflow from './scenes/05-fleetflow?scene';
import atlas from './scenes/06-atlas?scene';
import moreSystems from './scenes/07-more-systems?scene';

export default makeProject({
  scenes: [
    cover,
    geoplatform,
    pulso,
    antiIa,
    fleetflow,
    atlas,
    moreSystems,
  ],
});
