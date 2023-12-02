import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import eslintPlugin from '@nabla/vite-plugin-eslint';
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label'
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh'
import pluginRewriteAll from 'vite-plugin-rewrite-all';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    pluginRewriteAll(),
    tsconfigPaths(),
    react({
      babel: {
        plugins: [jotaiDebugLabel, jotaiReactRefresh]
      }
    }),
    VitePWA({ registerType: "autoUpdate" }),
    eslintPlugin()
  ],
})
