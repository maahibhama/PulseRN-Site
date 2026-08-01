---
title: Session archives
description: Export, validate, share, and restore PulseRN debugging sessions.
---

Open **Sessions** to export one retained session or all listed sessions. Import uses a native file
picker and restores accepted data into the local database.

## What an archive contains

`.pulsern` archives are gzip-compressed, versioned JSON. Archive format version 2 contains:

- a manifest with export time, counts, version, and redaction metadata;
- validated device and session metadata;
- the events belonging to those sessions;
- bookmarks and annotations stored separately from immutable events;
- a SHA-256 checksum for every device, session, event, bookmark, and annotation.

## Import validation

Electron main validates an archive before changing SQLite. It rejects:

- unknown archive versions;
- malformed events or relationships;
- undeclared session references;
- count or checksum mismatches;
- files larger than 100 MiB compressed;
- payloads larger than 512 MiB after decompression.

A valid import writes all related data in one transaction. Event IDs remain unique, so importing the
same archive again does not duplicate events. Normal retention rules run immediately afterward.

## Sharing safely

Archives can contain request bodies, application state, console values, routes, and error context.
PulseRN preserves the redaction already applied during capture, but it cannot determine whether
free-form strings contain a secret.

Review an archive's source session and your project's data policy before sharing it. Do not commit
archives or production captures to a repository.
