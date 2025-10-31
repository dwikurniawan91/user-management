# Demo: https://uswr.netlify.app/
# User Management App

Interactive user directory built with React, TypeScript, and Vite. It fetches users from a configurable API, lets you add/update/delete records in memory, and showcases modern component patterns (forms, dialogs, skeleton loading states) alongside a production-ready toolchain (testing, Docker, CI/CD, Netlify deploys).

## Features

- 🎯 **User CRUD UI** – Browse, add, update, and delete users inside an accessible, responsive layout.
- 🔄 **API-backed Store** – Zustand store orchestrates fetching, optimistic updates, and local mutations.
- 🧭 **Routing & Not Found** – Client-side routing via React Router with a dedicated 404 page.
- ✅ **Form Validation** – User form powered by `react-hook-form` + `zod` for schema enforcement.
- 🍞 **Toast & Error Boundary** – Global error handling with Sonner toasts and a reusable error boundary.
- 🎨 **UI Building Blocks** – Radix UI primitives, Tailwind utilities, and custom components (`Button`, `Card`, `Skeleton`, etc.).
- 🧪 **Testing** – Vitest + React Testing Library cover store logic, forms, and page flows.
- 🚢 **DevOps Ready** – Dockerized dev/test/build pipeline plus GitHub Actions → Netlify deployment.

## Stack & Libraries

- **Framework**: React 19, Vite 7, TypeScript 5
- **State**: Zustand
- **Forms & Validation**: react-hook-form, zod, @hookform/resolvers
- **Routing**: react-router-dom
- **UI/Styling**: Tailwind CSS (via `@tailwindcss/vite`), Radix UI primitives, class-variance-authority, lucide-react icons, Sonner toasts, motion
- **Testing**: Vitest, @testing-library/react, @testing-library/jest-dom
- **Tooling**: ESLint, Prettier, Docker, GitHub Actions, Netlify

## Project Structure

- `src/page/UserList/UsersList.tsx` – Main screen with list, dialogs, toasts, and skeleton loaders.
- `src/components/ui/UserForm/UserForm.tsx` – Controlled form with validation and keyboard navigation.
- `src/stores/userStore.ts` – Zustand store for user state + CRUD actions.
- `src/services/userService.ts` – API helper + avatar assignment logic.
- `src/components/ui/ErrorBoundary/ErrorBoundary.tsx` – Application-wide error boundary.
- `src/page/NotFound/NotFound.tsx` – 404 route.
- `src/components/ui` – Shared UI primitives (button, card, input, skeleton, etc.).

## Environment Variables

Set `VITE_API_URL` to point at the upstream user API.

```bash
# .env
VITE_API_URL=https://jsonplaceholder.typicode.com/users
```

- Copy `.env.example` → `.env` before running Docker or Vite.
- CI/CD consumes the value from the `VITE_API_URL` GitHub secret if provided (falls back to JSONPlaceholder).

## Local Development

```bash
npm install
npm run dev
```

- App runs at `http://localhost:5173`.
- The store seeds avatars using `pravatar.cc` on fetch.

## Testing

```bash
npm test -- --run         # run Vitest suite once
npm test                  # watch mode
docker compose run test   # run tests inside Docker
```

Covered scenarios:

- Form validation, submissions, and cancel states.
- UsersList behaviors (loading skeletons, errors, add dialog).
- Zustand store (fetch success/failure, mutations).
- Error boundary fallback rendering + toasts.
- NotFound route output.

## Build & Preview

```bash
npm run build             # type-check + vite build -> dist
npm run preview           # serve the built assets
docker compose up app     # build + run production image on port 8080
```

## Docker Workflows

| Command | Description |
| --- | --- |
| `docker compose up dev` | Run Vite dev server in container (`5173`). |
| `docker compose run test` | Execute the test suite in a disposable container. |
| `docker compose up app` | Build multi-stage image & serve via Nginx (`8080`). |

> `.dockerignore` ensures node_modules/dist aren’t copied into builds.

## CI/CD Pipeline (GitHub Actions)

- Defined in `.github/workflows/ci.yml`.
- Triggers on pushes to `main` and pull requests targeting `main`.
- Stages:
  1. **Test** – Runs Vitest in Docker (`docker compose run test`).
  2. **Build** – Builds Docker image, extracts `dist`, uploads artifact.
  3. **Deploy** – Installs the Netlify CLI and publishes `dist` (skipped for PRs).
  4. **Cleanup** – Docker prune to keep runners clean.

### Required GitHub Secrets

- `VITE_API_URL` – API endpoint for build/test (optional, falls back to JSONPlaceholder).
- `NETLIFY_AUTH_TOKEN` – Netlify personal access token.
- `NETLIFY_SITE_ID` – Netlify site ID receiving deployments.

## Deployments (Netlify)

We use **Actions-only deploys**:

- GitHub Actions builds and uploads `dist` via `netlify-cli`.
- `netlify.toml` skips Netlify’s native build (`ignore = "exit 0"`).
- In Netlify UI → **Site settings → Build & deploy**, click **Stop builds** (or keep them disabled) to avoid duplicate work.

Manual deploy (optional):

```bash
npm run build
npx netlify deploy --dir=dist --prod
```

Ensure `VITE_API_URL` is set in Netlify site environment variables if you rely on a non-default backend.
