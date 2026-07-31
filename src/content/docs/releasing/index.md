---
title: Releasing
description: Prepare, validate, and publish PulseRN desktop and SDK releases.
---

Only maintainers with repository and publishing access should run release commands. Start from a clean working tree.

## Desktop release

Preview without changing files or Git:

```bash
pnpm release:desktop 0.1.0 --dry-run
```

Publish from a version tag:

```bash
pnpm release:desktop 0.1.0
```

The script updates package and Homebrew Cask versions, runs repository checks, commits when needed, pushes the branch, and creates an annotated tag. Prerelease versions such as `v0.2.0-beta.1` become GitHub prereleases.

Required artifact names:

```text
PulseRN-<version>-mac-arm64.dmg
PulseRN-<version>-mac-x64.dmg
PulseRN-<version>-windows-x64-setup.exe
PulseRN-<version>-windows-arm64-setup.exe
PulseRN-<version>-linux-x64.AppImage
PulseRN-<version>-linux-x64.deb
SHA256SUMS.txt
```

The publishing job runs only after verification and every platform package succeeds.

## Local packaging

```bash
pnpm pack:desktop
pnpm dist:mac
pnpm dist:win:x64
pnpm dist:win:arm64
pnpm dist:linux
```

Preview packages are intentionally unsigned.

## SDK release

Configure npm Trusted Publishing for the `@pulse-rn` scope, repository, `release-sdk.yml` workflow, and `npm` GitHub environment.

```bash
pnpm release:sdk 0.2.1 --dry-run
pnpm release:sdk 0.2.1
```

Stable `sdk-vX.Y.Z` tags publish to npm’s `latest` channel; prereleases publish to `next`. Use `--replace-tag` only to recover a tag whose version was not published. Use `--skip-checks` only when the exact commit already passed the full suite.

## Release documentation checklist

- Verify installer commands and artifact links.
- Verify SDK version and API examples.
- Update compatibility and roadmap status.
- Confirm download checksums.
- Apply matching documentation updates in both the PulseRN and website repositories.
