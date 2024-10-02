import { defineConfig } from 'vite';
import urls from './urls';

export default defineConfig(({ mode }) => {
  console.log(mode);
  const plugins = [];

  return {
    plugins: plugins,
    build: {
      minify: false,

      rollupOptions: {
        input: urls.map,
        output: {
          entryFileNames: '[name]/index.js'
        }
      }
    }
  };
});
