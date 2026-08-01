# PulseRN website

The product website and documentation portal for
[PulseRN](https://github.com/maahibhama/PulseRN), built with Astro and
Starlight.

## Develop locally

Requires Node.js 22.12 or newer and pnpm 10.14.

```sh
pnpm install
pnpm dev
```

The local site is available at `http://localhost:4321`.

## Validate

```sh
pnpm format:check
pnpm validate
node --test test/releases.test.mjs
```

`pnpm validate` checks Astro content and types, creates the production build,
and verifies internal links.

## Publish on GitHub Pages

1. Create the public repository `maahibhama/maahibhama.github.io`.
2. Add it as this repository's `origin` and push the `main` branch.
3. In the GitHub repository, open **Settings → Pages** and choose
   **GitHub Actions** as the source.
4. The included `Deploy GitHub Pages` workflow validates and deploys the site
   to `https://maahibhama.github.io/PulseRN-Site/`.

The workflow uses GitHub's built-in token only during the build to obtain the
latest stable PulseRN release. No token is shipped to the browser. If release
data is unavailable, the checked-in fallback record is displayed.

## Documentation maintenance

Website documentation lives in `src/content/docs`. PulseRN's application
repository keeps its own Markdown documentation, so release pull requests
should use `.github/RELEASE_CHECKLIST.md` to review both copies for parity.
