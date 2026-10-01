# Changelog

## [1.3.0](https://github.com/Safi1012/shrink-me/compare/shrink-me-v1.2.1...shrink-me-v1.3.0) (2026-10-01)


### Features

* **privacy:** only let the page talk to shrinkme.app ([1c00faa](https://github.com/Safi1012/shrink-me/commit/1c00faa2e3250fddfef6ceb4949e7deed41fa86c))


### Bug Fixes

* **counter:** stop the totals at the largest safe integer ([02fce22](https://github.com/Safi1012/shrink-me/commit/02fce22ef31355648efd82e9092252807bdbf47d))

## [1.2.1](https://github.com/Safi1012/shrink-me/compare/shrink-me-v1.2.0...shrink-me-v1.2.1) (2026-10-01)


### Bug Fixes

* **i18n:** line up the language picker with the name in the footer ([7557004](https://github.com/Safi1012/shrink-me/commit/7557004a9aeff3cb57a3eff6ee1eaa40e2ad0d00))

## [1.2.0](https://github.com/Safi1012/shrink-me/compare/shrink-me-v1.1.0...shrink-me-v1.2.0) (2026-10-01)


### Features

* **i18n:** add Chinese, Hindi, Spanish, Arabic, Bengali and Portuguese ([0849792](https://github.com/Safi1012/shrink-me/commit/08497920a22f7a4b1460d5c3ef6f5ac70e8e2255))
* link to the GitHub repository from the app ([73bb04f](https://github.com/Safi1012/shrink-me/commit/73bb04f64f3227828fb6bf16eccab2b61551fe7e))

## [1.1.0](https://github.com/Safi1012/shrink-me/compare/shrink-me-v1.0.0...shrink-me-v1.1.0) (2026-10-01)


### Features

* show the changelog when clicking the version on the contact page ([74a28d4](https://github.com/Safi1012/shrink-me/commit/74a28d4e9431c4309860719b3c7b707bf1e4b328))

## 1.0.0 (2026-10-01)


### Features

* compress PDFs with Ghostscript 10.06 in a Web Worker
* move the live counter to a Cloudflare Durable Object, pushed to visitors over WebSockets
* replace the odometer with a rolling number component
* rewrite the legal pages for German law and give them a shared design
* add AVIF images
* show saved sizes in the same units everywhere


### Bug Fixes

* fix stuck compressions, lost duplicates and empty selections
* stop mid-deploy SPA fallbacks from poisoning the offline cache


### Performance Improvements

* speed up the first load and shrink the service worker precache
