import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), react(), icon()],
  site: 'https://lutic.at',
});