---
title: Compatibility
description: Supported React Native, Expo, Hermes, operating-system, and package configurations.
---

## Application compatibility

| Component             | Supported baseline                       | Notes                                                           |
| --------------------- | ---------------------------------------- | --------------------------------------------------------------- |
| React Native          | 0.76 or newer                            | Hermes development builds; the new architecture is supported    |
| Repository examples   | React Native 0.86.2                      | Expo development build and Community CLI examples               |
| Expo                  | Development builds                       | Expo Go cannot load optional native storage modules             |
| React Navigation      | Supported                                | Includes nested-route ownership and lifecycle tracking          |
| Expo Router           | Supported through the navigation tracker | Events are normalized with React Navigation and manual tracking |
| Redux / Redux Toolkit | Supported                                | Read-only action, state, diff, timing, and correlation capture  |
| AsyncStorage          | Supported                                | Install it in the application and register the provider         |
| MMKV v3/v4            | Supported                                | MMKV v4 requires Nitro modules and a native development build   |

JavaScript-only capture can work in Expo Go, but integrations that depend on custom native modules
require a development build.

## Debugger compatibility

The Sources debugger requires a Hermes development runtime exposed through Metro's Chrome DevTools
Protocol endpoint. PulseRN connects to one target at a time and supports original source maps,
breakpoints, stepping, scopes, watches, evaluation, React component inspection, and JavaScript render
profiling.

JavaScriptCore, production runtimes, native Swift/Kotlin/C++ debugging, source editing, simultaneous
targets, and React prop/state mutation are not supported.

React component metadata and on-device highlighting depend on capabilities exposed by the
version-matched React DevTools backend bundled with React Native. PulseRN falls back to a safe,
read-only component tree when interactive inspection is unavailable.

## Desktop and device support

| Platform            | Packages                           | Notes                                                                |
| ------------------- | ---------------------------------- | -------------------------------------------------------------------- |
| macOS               | Apple Silicon and Intel DMGs       | Preview builds may show Gatekeeper warnings                          |
| Windows             | x64 and ARM64 installers           | Preview builds may show SmartScreen warnings                         |
| Linux               | x86-64 AppImage and Debian package | Linux ARM packages are not currently available                       |
| iOS Simulator       | Supported                          | Use `127.0.0.1`                                                      |
| Android Emulator    | Supported                          | Use `10.0.2.2`                                                       |
| USB Android device  | Supported                          | Use `adb reverse tcp:9090 tcp:9090`                                  |
| Physical LAN device | Supported with pairing             | Enable LAN access and use a one-time pairing code or reconnect token |

## Browser edition

The published `@maahibhama/pulsern` CLI requires Node.js 22.5 or newer. It serves the same debugger
UI on a local browser endpoint and supports the same React Native SDK, inspectors, retained history,
Hermes connection, and authenticated device-pairing flow.

The browser edition stores its settings and SQLite history separately from the Electron app. Native
desktop update controls and launch-at-login settings are intentionally unavailable. Use `.pulsern`
session archives to move retained sessions between the browser and desktop editions.

TLS is optional for LAN development and requires a user-provided certificate and private key. The
device must trust the issuing certificate authority, and the certificate must cover the selected
host or IP address.

## Package formats

`@pulse-rn/sdk` ships ESM, CommonJS, TypeScript declarations, and React Native-compatible entry
points. Optional integrations remain application dependencies and are not imported eagerly.

Protocol v1 remains readable. New behavior is added through optional fields and capability
negotiation. Unknown future database, archive, settings, or update metadata versions fail closed.
