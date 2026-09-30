# 🚀 Shrink Me

Shrink Me is a versatile image and pdf compression tool (static website) designed for JPG, PNG, WEBP, SVG, and PDF formats.\
When you require a straightforward and user-friendly solution to compress images, Shrink Me is the ideal tool for your needs.

## 🛠️ Tech Stack

- **Vue 3**: A progressive JavaScript framework for building user interfaces.
- **TypeScript**: A strongly-typed superset of JavaScript that adds static typing to the language.
- **Pinia**: Intuitive, type-safe store for Vue 3.
- **Compressor.js**: A pure JavaScript image compressor library.
- **SVGO**: A Node.js tool for optimizing SVG files.
- **WebAssembly (WASM)**: A binary instruction format for a stack-based virtual machine.
- **Cloudflare Workers & Durable Objects**: The live "files compressed" counter (`workers/counter`), pushed to visitors over hibernatable WebSockets.

## 📦 Run & Build

Requires [Node.js](https://nodejs.org/) 24 LTS (see `.nvmrc`). The package manager ([pnpm](https://pnpm.io/)) is pinned via the `packageManager` field and provided by [Corepack](https://github.com/nodejs/corepack), so enable it once:

```sh
corepack enable
```

All commands are run from the root of the project, from a terminal:

| Command               | Action                                                                     |
| :-------------------- | :------------------------------------------------------------------------- |
| `pnpm install`        | Installs dependencies                                                      |
| `pnpm dev`            | Starts local dev server at `localhost:5173`                                |
| `pnpm dev:counter`    | Starts the live counter Worker at `localhost:8787` (proxied by `pnpm dev`) |
| `pnpm build`          | Type-Check, Compile and Minify for Production                              |
| `pnpm test:unit`      | Run Unit Tests with [Vitest](https://vitest.dev/)                          |
| `pnpm test:e2e`       | Run End-to-End Tests with [Playwright](https://playwright.dev)             |
| `pnpm lint`           | Lint with [Oxlint](https://oxc.rs/docs/guide/usage/linter)                 |
| `pnpm format`         | Format with [Oxfmt](https://oxc.rs/docs/guide/usage/formatter)             |
| `pnpm deploy:counter` | Deploys the live counter Worker (also done by CI on `main`)                |

## 💻 Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) +
[Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) +
[TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

## 🤝 Contributing

Contributions are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is licensed under the [MIT License](LICENSE).
