import {resolve} from 'node:path';
import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';

export default defineConfig({
  server: {
    fs: {
      allow: [resolve(__dirname, '../..')],
    },
  },
  plugins: [motionCanvas(), ffmpeg()],
});
