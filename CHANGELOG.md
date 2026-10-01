# Changelog

## [1.1.0](https://github.com/Safi1012/shrink-me/compare/shrink-me-v1.0.0...shrink-me-v1.1.0) (2026-10-01)


### Features

* show the changelog when clicking the version on the contact page ([d309766](https://github.com/Safi1012/shrink-me/commit/d30976629aa8a228bc6c5a69381e64dc649833e7))

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
