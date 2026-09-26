# Hydrangean Diva

A web-based media player for building play queues and playlists from embedded players — YouTube, Niconico, SoundCloud, Spotify, Vimeo, Dailymotion, Twitch and plain audio files.

**Try it:** https://ycanardeau.github.io/hydrangean-diva/

## Features

- Paste a video URL to add it to the play queue
- Create, rename, delete and reorder (drag and drop) playlists
- Bottom-bar player controls with seek bar, repeat and shuffle, plus a mini player
- State is saved in the browser (`localStorage`), so the app works without a backend
- Installable as a PWA

## Repository layout

```
.
├── frontend/                  pnpm + Nx monorepo
│   └── packages/
│       ├── hydrangean-diva/   The app (React, Vite, Elastic UI, MobX, TanStack Router)
│       ├── nostalgic-diva/    @aigamo/nostalgic-diva — React components for controlling embedded players
│       ├── route-sphere/      @aigamo/route-sphere — sync query params with MobX stores
│       └── catalog/           @aigamo/catalog — shared pnpm catalog for @aigamo projects
└── backend/                   .NET 10 / .NET Aspire API (work in progress)
    ├── HydrangeanDiva/                 API host
    ├── HydrangeanDiva.AppHost/         Aspire orchestration (Postgres, API, frontend, reverse proxy)
    ├── HydrangeanDiva.ReverseProxy/    YARP proxy: /api/* → API, everything else → frontend
    └── Modules/MediaPlayer/            Playlist module (Domain, Application, Infrastructure, Endpoints, …)
```

Each library package has its own README: [nostalgic-diva](frontend/packages/nostalgic-diva/README.md), [route-sphere](frontend/packages/route-sphere/README.md), [catalog](frontend/packages/catalog/README.md).

## Getting started

### Frontend only

Requires Node.js 24 and pnpm 10.

```bash
cd frontend
pnpm install
pnpm build
pnpm --filter hydrangean-diva dev
```

`pnpm build` builds the workspace libraries (`nostalgic-diva`, `route-sphere`) that the app depends on; run it once before starting the dev server.

Other scripts in `frontend/packages/hydrangean-diva`:

| Script           | Description                            |
| ---------------- | -------------------------------------- |
| `pnpm dev`       | Start the Vite dev server              |
| `pnpm build:app` | Build the app for deployment (`dist/`) |
| `pnpm preview`   | Preview the production build           |
| `pnpm test`      | Run tests with Vitest                  |
| `pnpm lint`      | Run ESLint                             |

### Full stack (Aspire)

Requires the .NET 10 SDK and Docker (for PostgreSQL), in addition to the frontend prerequisites.

```bash
cd backend
dotnet run --project HydrangeanDiva.AppHost
```

The AppHost starts PostgreSQL (with pgAdmin), runs the database migrations, then launches the API, the frontend dev server and the reverse proxy. Open the Aspire dashboard link printed in the console to see the endpoints.

## Deployment and releases

- **GitHub Pages** — every push to `main` builds the app and deploys it ([static.yml](.github/workflows/static.yml)).
- **npm** — versions are bumped with `pnpm release` (Nx Release, from `frontend/`), then published by manually running the [Publish workflow](.github/workflows/npm-publish.yml).
