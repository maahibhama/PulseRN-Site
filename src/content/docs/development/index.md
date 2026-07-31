---
title: Local development
description: Build the PulseRN monorepo and run its desktop and React Native examples.
---

## Prerequisites

- Node.js 22 LTS recommended (20.19 minimum)
- pnpm 10.14
- Xcode for iOS or Android Studio for Android

## Run the desktop app

```bash
pnpm install
pnpm dev:desktop
```

Workspace packages build before dependents through Turborepo.

## Run an example

For the Expo development build:

```bash
pnpm --filter @pulse-rn/example-react-native ios
# or
pnpm --filter @pulse-rn/example-react-native android
```

After the native app is installed, normal Metro restarts use:

```bash
pnpm --filter @pulse-rn/example-react-native dev
```

The example contains MMKV/Nitro modules and cannot run in Expo Go.

For the Community CLI example, install iOS pods once, start Metro, then run the platform target:

```bash
cd apps/example-react-native-cli/ios
pod install
cd ../../..
pnpm --filter @pulse-rn/example-react-native-cli start
```

## Verify a change

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm lint
```

The desktop database lives in Electron’s platform `userData` directory, not the repository. Electron may print an experimental warning for its bundled `node:sqlite`; database access is isolated behind `EventDatabase`.

See [Contributing](/contributing/) before opening a pull request and [Releasing](/releasing/) for packaging.
