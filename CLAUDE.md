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
- CSS variables in [lutica-ds/tokens.css](src/styles/lutica-ds/tokens.css) define colors for each theme via `[data-theme="light"]` and `[data-theme="dark"]` attributes
- System theme respects `prefers-color-scheme` media query

### Design System

The site uses the Lutica Design System (https://claude.ai/artifact/DwArjsh98Mu3CJDUkhzZuu), vendored in `src/styles/lutica-ds/`:

- `tokens.css` is generated from the system's `tokens.json`; `bundle.css` (the `lu-*` component classes) and `fonts/` are copied as-is. Do not hand-edit them
- [style.scss](src/styles/style.scss) only holds what the system doesn't cover (`figure`, `details`, `_sns-button`, etc.)
- Article content goes inside `.lu-prose` ([Article.astro](src/components/Article.astro) and [Blog.astro](src/layouts/Blog.astro) already apply it); UI does not

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
- **External CSS**: Uses sanitize.css from a CDN for CSS reset. The Koruri font is self-hosted through the design system
- **Japanese Language**: All content and UI text is in Japanese
- **Share Buttons**: Blog posts have share buttons configured for Japanese social media (Misskey instance at mk.shrimpia.network)
- **Dev Mode Badge**: Navbar shows "DEV MODE" badge in development environment

### Styling Conventions

- Prefer the design system's `lu-*` classes (e.g., `lu-card`, `lu-button`, `lu-stack`, `lu-container`). Site-specific global classes are prefixed with `_` (e.g., `._sns-button`, `._emoji`)
- CSS variables for theming and sizes (e.g., `var(--foreground)`, `var(--panel)`, `var(--primary)`, `var(--space-4)`); never hard-code colors
- Scoped styles using `<style lang="scss">` in Astro components
- Global styles using `<style lang="scss" is:global>` when needed

## Development Notes

- The site uses `pnpm` for package management (check `node_modules/.pnpm/`)
- TypeScript config extends Astro's base with `esModuleInterop: true` and `jsx: "react"`
- Rollup version pinned to 3.19.1 in dependencies (likely for compatibility)
- Icons use `astro-icon` with Iconify collections (@iconify-json/*)
