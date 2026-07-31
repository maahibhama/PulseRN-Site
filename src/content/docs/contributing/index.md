---
title: Contributing
description: Prepare a focused, secure, and testable contribution to PulseRN.
---

Contributions are welcome. Discuss substantial features in an issue before implementation so their design and roadmap fit can be agreed.

## Workflow

1. Fork [PulseRN](https://github.com/maahibhama/PulseRN) and create a focused branch.
2. Follow [Local development](/development/) to install and run the project.
3. Add tests for behavioral changes.
4. Run `pnpm typecheck`, `pnpm test`, `pnpm build`, and `pnpm lint`.
5. Open a pull request limited to one concern.

## Engineering standards

Use strict TypeScript, explicit types, small modules, and validated runtime boundaries. Preserve renderer sandboxing. Avoid `any`, `eval`, and APIs that expose Node primitives to renderer code.

Never commit captured application data, credentials, device identifiers, or `.rndebug` files. Review the [security policy](/security/) when changing transport, persistence, IPC, or redaction.

## Documentation checklist

When behavior changes, update both the application repository documentation and this website. Release pull requests must review installation, SDK setup, compatibility, downloads, and roadmap content for drift.

Contributions are licensed under the project’s MIT License.
