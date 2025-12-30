# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website (lutica.net) built with Astro. It's a Japanese-language site featuring a blog, portfolio (works page), and about page. The site has a custom theme system with light/dark modes and uses PhotoSwipe for image lightboxes.

## Commands

### Development
- `npm run dev` or `npm start` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run astro` - Run Astro CLI directly

### Type Checking
- `npx astro check` - Run TypeScript type checking for Astro files

## Architecture

### Core Framework
- **Astro 5.x** with SSG (Static Site Generation)
- **React 18** for interactive components (limited usage)
- **TypeScript** with strict mode disabled (uses Astro's base config)
- **SCSS** for styling with CSS variables for theming

### Directory Structure

```
src/
├── components/          # Reusable Astro/React components
│   ├── domains/        # Feature-specific components (blog, gyagu, shrimpia, etc.)
│   ├── Navbar.astro    # Fixed navigation bar
│   └── ThemeButton.astro # Theme switcher (system/light/dark)
├── content/            # Content collections (managed by Astro)
│   ├── blog/          # Blog posts (.md and .mdx files)
│   └── config.ts      # Content schema definitions
├── layouts/           # Page layouts
│   ├── Layout.astro   # Base layout with theme, navbar, footer, PhotoSwipe
│   ├── Blog.astro     # Blog post layout with share buttons
│   └── Markdown.astro # Markdown content layout
├── pages/             # File-based routing
│   ├── blog/
│   │   ├── [...slug].astro # Dynamic blog post pages
│   │   └── index.astro     # Blog listing page
│   ├── index.astro    # Homepage
│   ├── about.md       # About page
│   └── works.astro    # Portfolio/works page
├── scripts/           # TypeScript utilities
│   └── const.ts       # Site constants (SITE_TITLE, SITE_DESCRIPTION)
└── styles/
    └── style.scss     # Global styles and theme variables
```

### Theme System

The site implements a 3-state theme system (system/light/dark):

- Theme preference stored in `localStorage` as `'theme'`
- Inline script in [Layout.astro](src/layouts/Layout.astro) prevents FOUC by setting `data-theme` attribute before page render
- [ThemeButton.astro](src/components/ThemeButton.astro) cycles through themes and updates localStorage
- CSS variables in [style.scss](src/styles/style.scss) define colors for each theme via `[data-theme="light"]` and `[data-theme="dark"]` attributes
- System theme respects `prefers-color-scheme` media query

### Content Management

Blog posts use Astro Content Collections:

- Posts stored in `src/content/blog/` as `.md` or `.mdx` files
- Schema defined in [src/content/config.ts](src/content/config.ts):
  - `title` (required)
  - `description` (optional)
  - `date` (required, string transformed to Date)
  - `draft` (optional, defaults to false)
- Dynamic routes in [src/pages/blog/[...slug].astro](src/pages/blog/[...slug].astro) using `getStaticPaths()`
- Layout in [src/layouts/Blog.astro](src/layouts/Blog.astro) includes share buttons for Misskey, Mastodon, X, and Web Share API

### Special Features

- **PhotoSwipe Integration**: Base layout initializes PhotoSwipe lightbox for all `.item` elements, used for image galleries
- **External CSS**: Uses Koruri font from external CDN and sanitize.css for CSS reset
- **Japanese Language**: All content and UI text is in Japanese
- **Share Buttons**: Blog posts have share buttons configured for Japanese social media (Misskey instance at mk.shrimpia.network)
- **Dev Mode Badge**: Navbar shows "DEV MODE" badge in development environment

### Styling Conventions

- Global SCSS classes prefixed with `_` (e.g., `._card`, `._article-card`, `._vstack`, `._hstack`)
- CSS variables for theming (e.g., `var(--foreground)`, `var(--background)`, `var(--primary)`)
- Scoped styles using `<style lang="scss">` in Astro components
- Global styles using `<style lang="scss" is:global>` when needed

## Development Notes

- The site uses `pnpm` for package management (check `node_modules/.pnpm/`)
- TypeScript config extends Astro's base with `esModuleInterop: true` and `jsx: "react"`
- Rollup version pinned to 3.19.1 in dependencies (likely for compatibility)
- Icons use `astro-icon` with Iconify collections (@iconify-json/*)
