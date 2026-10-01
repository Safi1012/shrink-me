# Shrink Me

[![CI](https://github.com/Safi1012/shrink-me/actions/workflows/pipeline.yml/badge.svg?branch=main)](https://github.com/Safi1012/shrink-me/actions/workflows/pipeline.yml)
[![Release](https://img.shields.io/github/v/release/Safi1012/shrink-me)](https://github.com/Safi1012/shrink-me/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-fe5196.svg)](https://www.conventionalcommits.org)

**Free, private image and PDF compression in your browser.**

**Try it live at [shrinkme.app](https://shrinkme.app/)**

Shrink Me compresses JPG, PNG, WEBP, SVG and PDF files. All compression runs on your device: the files never leave your browser, and nothing is uploaded to a server.

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Deployment](#deployment)
- [Versioning and Releases](#versioning-and-releases)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## Features

- **Private by design**: all compression runs in the browser, so your files stay on your device.
- **Images**: compresses JPG, PNG and WEBP (60% quality for JPG and WEBP) and optimizes SVG.
- **PDFs**: compresses PDFs with Ghostscript compiled to WebAssembly, running in a Web Worker.
- **Batch processing**: compresses any number of files at once and downloads them as a single ZIP.
- **Works offline**: an installable Progressive Web App (PWA) with a service worker.
- **Multilingual**: available in English, German and French.
- **Live counter**: a global count of compressed files and saved bytes, updated live over WebSockets.

## How It Works

| Format          | Library                                                                                          | Runs in     |
| :-------------- | :----------------------------------------------------------------------------------------------- | :---------- |
| JPG, PNG, WEBP  | [Compressor.js](https://github.com/fengyuanchen/compressorjs)                                    | Main thread |
| SVG             | [SVGO](https://github.com/svg/svgo)                                                              | Main thread |
| PDF             | [Ghostscript](https://www.ghostscript.com/) via [`@okathira/ghostpdl-wasm`](https://www.npmjs.com/package/@okathira/ghostpdl-wasm) | Web Worker  |

The app is a static [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/) single-page app built with [Vite](https://vite.dev/), styled with [Tailwind CSS](https://tailwindcss.com/), with state in [Pinia](https://pinia.vuejs.org/). It is hosted on [Cloudflare Pages](https://pages.cloudflare.com/).

The only server-side part is the live counter. It is a [Cloudflare Worker](https://developers.cloudflare.com/workers/) with a [Durable Object](https://developers.cloudflare.com/durable-objects/) ([`workers/counter`](workers/counter)) that pushes totals to visitors over hibernatable WebSockets. It only receives numbers (files compressed and bytes saved), never files.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 24 LTS (the exact version is in [`.nvmrc`](.nvmrc))
- [pnpm](https://pnpm.io/), provided by [Corepack](https://github.com/nodejs/corepack) at the version pinned in `package.json`

### Setup

```sh
git clone https://github.com/Safi1012/shrink-me.git
cd shrink-me
corepack enable
pnpm install
cp .env.example .env.local   # placeholder details for the legal pages
pnpm dev
```

Then open [localhost:5173](http://localhost:5173).

`pnpm dev` starts both the Vite dev server and the counter Worker (on `localhost:8787`, proxied under `/api`). The app also works without the Worker; only the live counter stays empty.

### Environment variables

The legal notice, privacy policy and contact page show the operator's name, address and email. These details are injected at build time and never committed. Locally, the git-ignored `.env.local` provides them; in CI, they come from the GitHub repository variables. See [`.env.example`](.env.example) for the full list. Its placeholder values are enough for development.

## Scripts

| Command               | Action                                                                  |
| :-------------------- | :---------------------------------------------------------------------- |
| `pnpm dev`            | Starts `dev:app` and `dev:counter` together                             |
| `pnpm dev:app`        | Starts the Vite dev server at `localhost:5173`                          |
| `pnpm dev:counter`    | Starts the live counter Worker at `localhost:8787`                      |
| `pnpm build`          | Type-checks and builds for production into `dist/`                      |
| `pnpm preview`        | Serves the production build locally                                     |
| `pnpm test:unit`      | Runs unit tests with [Vitest](https://vitest.dev/) (watch mode)         |
| `pnpm test:e2e`       | Runs end-to-end tests with [Playwright](https://playwright.dev)         |
| `pnpm lint`           | Lints and auto-fixes with [Oxlint](https://oxc.rs/docs/guide/usage/linter) |
| `pnpm format`         | Formats with [Oxfmt](https://oxc.rs/docs/guide/usage/formatter)         |
| `pnpm type-check`     | Type-checks every project with `vue-tsc --build`                        |
| `pnpm deploy:counter` | Deploys the counter Worker (CI does this on `main`)                     |

## Project Structure

```text
├── e2e/                 Playwright end-to-end tests and fixtures
├── public/              Static assets copied as-is (icons, manifest, robots.txt, …)
├── src/
│   ├── components/      layout/ (page sections) and shared/ (file handling, counter, …)
│   ├── ghostscript/     PDF compression Web Worker
│   ├── locales/         Translations (en, de, fr)
│   ├── router/          Vue Router routes
│   ├── stores/          Pinia stores
│   ├── utils/           Compression and file helpers
│   └── views/           Route-level pages
├── workers/counter/     Cloudflare Worker + Durable Object for the live counter
└── .github/             CI pipeline and release workflow
```

Unit tests (`*.spec.ts`) sit next to the code they cover.

## Testing

```sh
pnpm test:unit --run                      # unit tests, single run
pnpm exec playwright install chromium webkit  # once, to download the browsers
pnpm test:e2e                             # e2e tests in Chromium and WebKit
pnpm test:e2e --project=chromium          # a single browser
```

Locally, the e2e tests start (or reuse) the dev server. CI runs them against the production build.

## Deployment

On every push to `main`, the [CI pipeline](.github/workflows/pipeline.yml) checks formatting, lints, runs the unit tests, builds the app, and runs the e2e tests in Chromium and WebKit. It then deploys the site to Cloudflare Pages and the counter Worker to Cloudflare. Pull requests from this repository also get a preview deployment. Pull requests from forks are checked but not deployed, because they don't get the deployment secrets.

## Versioning and Releases

Shrink Me follows [Semantic Versioning](https://semver.org) and is released with [release-please](https://github.com/googleapis/release-please). Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org), because they decide the next version and end up in the changelog:

| Commit message                                  | Release | Changelog section |
| :---------------------------------------------- | :------ | :---------------- |
| `fix: keep the file name of renamed PNGs`       | Patch   | Bug Fixes         |
| `perf: decode images off the main thread`       | Patch   | Performance       |
| `feat: let the JPG quality be chosen`           | Minor   | Features          |
| `feat!: drop support for Safari 15`             | Major   | Breaking Changes  |
| `chore:`, `ci:`, `test:`, `docs:`, `refactor:`, `build:`, `style:` | None | Not listed |

On every push to `main`, release-please keeps a release pull request open that bumps `package.json` and adds the new entries to [`CHANGELOG.md`](CHANGELOG.md). Merging it tags the release and publishes it on GitHub. The deploy that follows ships the new version, and its changelog appears at [shrinkme.app/changelog](https://shrinkme.app/changelog).

## Contributing

Contributions are welcome, from bug reports and translations to new features.

1. For anything bigger than a small fix, please [open an issue](https://github.com/Safi1012/shrink-me/issues) first to discuss the change.
2. Fork the repository and create a branch from `main`.
3. Make your change, and add or update tests where it makes sense.
4. Make sure these pass locally:
   ```sh
   pnpm format:check && pnpm lint:check && pnpm type-check && pnpm test:unit --run
   ```
5. Commit using [Conventional Commits](https://www.conventionalcommits.org) (for example `fix(pdf): keep the page size of rotated pages`).
6. Open a pull request against `main` that describes what changed and why.

Using an AI coding agent? Point it at [`AGENTS.md`](AGENTS.md), which describes the project's conventions and the checks a change has to pass.

### Recommended IDE setup

[VS Code](https://code.visualstudio.com/) with the extensions recommended in [`.vscode/extensions.json`](.vscode/extensions.json): Vue (Volar), Playwright and Oxc.

## Security

Please don't report security vulnerabilities in public issues. Report them privately through [GitHub's private vulnerability reporting](https://github.com/Safi1012/shrink-me/security/advisories/new) instead.

## License

Shrink Me is licensed under the [MIT License](LICENSE).

The credits for third-party images, icons and libraries are listed on [shrinkme.app/credits](https://shrinkme.app/credits).
