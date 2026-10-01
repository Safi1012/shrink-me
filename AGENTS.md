# AGENTS.md

Guidance for AI coding agents (and the humans steering them) contributing to Shrink Me. Read [`README.md`](README.md) for the project overview. This file covers what an agent needs to make a change that passes review.

## Project in one paragraph

Shrink Me ([shrinkme.app](https://shrinkme.app/)) is a static Vue 3 + TypeScript single-page app that compresses images (Compressor.js, SVGO) and PDFs (Ghostscript WebAssembly in a Web Worker) entirely in the browser. **Files must never leave the user's device**, so don't add code that uploads, logs or sends file contents anywhere. The only backend is a Cloudflare Worker and Durable Object in `workers/counter`. It keeps a global counter of compressed files and saved bytes, and only ever receives those two numbers.

## Setup

```sh
corepack enable          # pnpm version is pinned in package.json "packageManager"
pnpm install
cp .env.example .env.local
```

- Use **pnpm** only. Never run `npm` or `yarn`, and never create another lockfile.
- Node version: see `.nvmrc` (Node 24 LTS).

## Checks to run before every commit

Run these and make sure they all pass. CI runs the same checks on every pull request:

```sh
pnpm format:check        # or `pnpm format` to fix
pnpm lint:check          # or `pnpm lint` to fix
pnpm type-check
pnpm test:unit --run     # plain `pnpm test:unit` starts watch mode and never exits
```

If the change affects the UI or the compression flow, also run the end-to-end tests:

```sh
pnpm exec playwright install chromium webkit   # first time only
pnpm test:e2e --project=chromium
```

`pnpm test:e2e` starts the Vite dev server itself (or reuses one already running on port 5173). It is slow, so pick a single project or spec file while iterating.

## Code layout

| Path                     | Contents                                                          |
| :----------------------- | :---------------------------------------------------------------- |
| `src/views/`             | Route-level pages (`/`, `/privacy`, `/legal`, `/credits`, `/contact`, `/changelog`) |
| `src/components/layout/` | Sections of the home page and shared page chrome                  |
| `src/components/shared/` | Reusable components: file handling (`File/`), counter, animations |
| `src/utils/`             | Compression and file helpers                                      |
| `src/ghostscript/`       | PDF compression Web Worker and its typed message protocol         |
| `src/stores/`            | Pinia stores (setup-function style)                               |
| `src/locales/`           | Translations: `en.json`, `de.json`, `fr.json`                     |
| `src/legal.ts`           | Operator details for the legal pages, read from env vars          |
| `workers/counter/`       | Cloudflare Worker + Durable Object for the live counter           |
| `e2e/`                   | Playwright specs and fixture files                                |

## Conventions

### Code style

- Oxfmt enforces the formatting: no semicolons, single quotes, 2-space indent, 100-column lines, no trailing commas. Don't fight it. Run `pnpm format`.
- Use Vue single-file components with `<script setup lang="ts">` and the Composition API. Pinia stores use the setup-function style (`defineStore('name', () => { … })`).
- Use Tailwind CSS utility classes for styling. The theme lives in `src/index.css`.
- Use the `@/` import alias for `src/`.
- Write comments that explain *why*, not *what*. Match the density of the surrounding code.
- Keep heavy work (like Ghostscript) off the main thread, and load large dependencies lazily. The service worker deliberately caches the 15 MB wasm on first use instead of precaching it (see `vite.config.ts`).

### Tests

- Put unit tests next to the code they cover as `*.spec.ts` (Vitest + jsdom).
- E2E specs go in `e2e/`, and their sample files in `e2e/fixtures/`.
- A bug fix should come with a test that would have caught the bug.

### Translations

- Add every user-facing string to **all three** locale files (`en`, `de`, `fr`) under the same key. Don't hard-code text in templates.
- The legal pages (`/legal`, `/privacy`) exist only in German (binding) and English. They are not translated through the locale files.

### Personal data

- Never commit real names, addresses, emails or phone numbers. The operator details shown on the legal pages come from `VITE_LEGAL_*` env vars: `.env.local` locally (git-ignored) and the GitHub repository variables in CI.
- Never commit `.env.local`, API tokens, or Cloudflare account IDs.

### Counter Worker

- After changing `workers/counter/wrangler.jsonc` bindings, regenerate the types with `pnpm types:counter`. Don't edit `worker-configuration.d.ts` by hand.
- The Worker only accepts origins listed in `ALLOWED_ORIGINS`. Keep it that way.

## Commits and pull requests

Commit messages **must** follow [Conventional Commits](https://www.conventionalcommits.org). [release-please](https://github.com/googleapis/release-please) derives the next version and the changelog from them.

```text
<type>(<optional scope>): <imperative summary in lower case>

<optional body: what changed and why, wrapped at ~72 columns>
```

| Type       | Use for                                          | Release |
| :--------- | :----------------------------------------------- | :------ |
| `feat`     | A user-visible feature                           | Minor   |
| `fix`      | A user-visible bug fix                           | Patch   |
| `perf`     | A performance improvement                        | Patch   |
| `refactor` | A code change with no behavior change            | None    |
| `test`     | Adding or fixing tests                           | None    |
| `docs`     | Documentation only                               | None    |
| `build`    | Dependencies, tooling, build config              | None    |
| `ci`       | GitHub Actions workflows                         | None    |
| `style`    | Formatting or purely visual tweaks with no logic | None    |
| `chore`    | Anything else                                    | None    |

- Mark breaking changes with `!` (`feat!: …`) or a `BREAKING CHANGE:` footer.
- Common scopes: `pdf`, `compression`, `counter`, `files`, `export`, `i18n`, `legal`, `privacy`, `pwa`, `e2e`, `deps`.
- Make one logical change per commit. Changelog entries are written for users, so describe the effect (`fix: keep the file name of renamed PNGs`), not the implementation.
- **Don't** edit `CHANGELOG.md`, the `version` in `package.json`, or `.release-please-manifest.json` by hand. Release-please owns them.
- Open pull requests against `main`, and explain *what* and *why* in the description. Disclose that an agent wrote or assisted with the change.

## Things to avoid

- Adding analytics, trackers, or third-party requests that could expose user files or behavior.
- Adding large runtime dependencies without discussing them in an issue first.
- Changing the deployment workflows (`.github/workflows/`) unless the task is explicitly about CI.
- Rewriting unrelated code, or reformatting files you didn't otherwise touch.
