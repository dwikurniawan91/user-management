# User Management App

React + TypeScript application scaffolded with Vite and enhanced with Docker and a GitHub Actions powered CI/CD pipeline.

## Requirements

- Node.js 20+ (only needed if you want to run locally without Docker)
- Docker & Docker Compose
- Netlify account (for automated deployments)

## Environment

Set `VITE_API_URL` to point at the user API. For local development you can create a `.env` file or export the value in your shell.

```
VITE_API_URL=https://jsonplaceholder.typicode.com/users
```

> Copy `.env.example` to `.env` and adjust the value for your environment before running any Docker commands.

## Local Development

```bash
npm install
npm run dev
```

### Docker workflows

| Command | Description |
| --- | --- |
| `docker compose up dev` | Start the Vite dev server inside Docker and expose it on port `5173`. |
| `docker compose run --rm test` | Execute the Vitest suite inside a disposable container. |
| `docker compose up app -d` | Build and run the production image served by Nginx on port `8080`. |

## CI/CD Pipeline

The GitHub Actions workflow in `.github/workflows/ci.yml` runs on every push to `main` and on pull requests targeting `main`. It comprises four stages:

1. **Test** – Runs the Vitest suite inside Docker (`docker compose run test`).
2. **Build** – Builds the production image, extracts the `dist` artifact, and uploads it for downstream jobs.
3. **Deploy** – Deploys the static bundle to Netlify on pushes to `main`. Pull requests still run the job but skip the deployment step.
4. **Cleanup** – Prunes Docker resources to keep the GitHub runner tidy.

### Required GitHub secrets

Create the following repository secrets before enabling the workflow:

- `VITE_API_URL` – The API endpoint used at build time (falls back to JSONPlaceholder when not provided).
- `NETLIFY_AUTH_TOKEN` – Personal access token from Netlify.
- `NETLIFY_SITE_ID` – Site ID of the Netlify project that should receive deployments.

### Netlify configuration

This project assumes **GitHub Actions-only deploys**. The workflow builds the site and uploads the `dist` folder via `netlify-cli`, so Netlify only serves the prebuilt assets.

To avoid duplicate builds:

1. Add `netlify.toml` (already included) to your repo. It sets `ignore = "exit 0"` so any Netlify-triggered builds are skipped automatically.
2. In the Netlify UI, open your site → **Site settings → Build & deploy → Continuous deployment** and click **Stop builds** (or set the skip command) so Netlify does not attempt to build on its own.
## Netlify deployment

The pipeline uses the official [`netlify/actions/cli`](https://github.com/netlify/actions) action to publish the `dist` directory. You can also deploy manually:

```bash
npm run build
npx netlify deploy --dir=dist --prod
```

Make sure your Netlify site is configured as a static build and that the `VITE_API_URL` environment variable is present in the site settings.
