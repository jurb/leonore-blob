# CLAUDE.md - Agent Instructions

## Build & Development Commands
- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run check` - Run type checking
- `pnpm run lint` - Run linting and formatting checks
- `pnpm run format` - Auto-format code with Prettier

## Code Style Guidelines
- **TypeScript**: Use strict typing with TypeScript
- **Formatting**: Follow Prettier defaults with Svelte plugin
- **Linting**: ESLint with Svelte and TypeScript plugins
- **Imports**: Use ES modules (`import` syntax)
- **Naming**: Use camelCase for variables/functions, PascalCase for components
- **Components**: Svelte 5 components with `.svelte` extension
- **Path Aliases**: Use `$lib/` for imports from the lib directory
- **Framework**: SvelteKit project structure with routes in `src/routes`
- **Dependencies**: Use PNPM as package manager