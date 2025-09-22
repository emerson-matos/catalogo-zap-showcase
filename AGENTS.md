# AGENTS.md

## Build / Lint / Dev
- Dev server: `pnpm dev`
- Build: `pnpm build` or `pnpm build:dev`
- Lint: `pnpm lint`
- Preview: `pnpm preview`
- No test script is present; unit tests not configured.

## Running Single Lint Check
- `pnpm lint -- <filepath>`

## Code Style Guidelines
- Use TypeScript with strict typing for all interfaces/props.
- Prefer named exports; keep imports ordered and deduplicated.
- Use functional components and arrow functions.
- Use Tailwind CSS for UI; use utility-first classes.
- Use React best practices (React hooks, avoid unused vars).
- Enable recommended ESLint/React/TypeScript rules.
- Use descriptive variable, prop and function names (camelCase for functions/vars, PascalCase for components).
- Error handling: always check/guard for type correctness and runtime errors.
- Follow the existing formatting for spaces/newlines and bracket placement (see codebase).

## Extra
- See `eslint.config.js` for full lint rules.
- Place all new code in `src/`, and UI in `src/components/ui`.
