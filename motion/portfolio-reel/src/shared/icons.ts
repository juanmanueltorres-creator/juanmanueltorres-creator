import layers from 'lucide-static/icons/layers.svg?raw';
import satellite from 'lucide-static/icons/satellite.svg?raw';
import route from 'lucide-static/icons/route.svg?raw';
import database from 'lucide-static/icons/database.svg?raw';
import activity from 'lucide-static/icons/activity.svg?raw';
import mapPin from 'lucide-static/icons/map-pin.svg?raw';
import gauge from 'lucide-static/icons/gauge.svg?raw';
import network from 'lucide-static/icons/network.svg?raw';
import fileText from 'lucide-static/icons/file-text.svg?raw';

export const ICONS = Object.freeze({
  layers,
  satellite,
  route,
  database,
  activity,
  mapPin,
  gauge,
  network,
  fileText,
});

export type IconName = keyof typeof ICONS;
