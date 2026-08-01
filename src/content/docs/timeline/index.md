---
title: Timeline and sessions
description: Navigate retained events, correlations, saved views, bookmarks, annotations, and portable sessions.
---

The unified timeline is PulseRN's central workspace. It combines console, network, Redux,
navigation, performance, storage, and error events in chronological order so a symptom can be read
in the context of what happened before and after it.

## Work with live and retained history

PulseRN keeps a bounded live projection in the renderer while SQLite retains older history according
to the configured age and event-count limits. Timeline and inspector views load deterministic cursor
pages instead of pulling the complete database into memory.

Use **Follow Latest** to keep the newest activity visible. Pause or clear the renderer view without
deleting persisted events. Permanent history deletion is a separate confirmed action.

The list supports:

- newest-first and oldest-first ordering;
- database-backed category, device, session, type, text, and time filters;
- keyboard navigation and bounded virtualization;
- parent and correlation links between related work;
- session boundaries and device/application identity;
- bookmarks and event annotations;
- reusable saved views for common filter combinations.

## Correlate a debugging story

Events may carry a `correlationId` or `parentId`. Inspector integrations can also attach route,
request, Redux, performance, console, and error context. PulseRN uses these explicit relationships
before weaker time-proximity signals.

A typical failed checkout can therefore be followed as:

```text
Navigation to Checkout
  → Redux checkout/submitted
  → POST /orders
  → network failure
  → handled application error
```

Select a related event to move between the timeline and its category inspector without losing the
current session context.

## Sessions and devices

A device ID represents a development installation. A session ID represents an application-defined
run, and a connection ID represents one WebSocket lifetime. Reconnection can preserve the same
device and session while receiving a new connection ID.

Open **Sessions** to browse retained runs and their application, platform, version, event count, and
connection history. Optional SDK identity helpers can preserve a device across launches and rotate
the session at a deliberate lifecycle boundary.

## Retention and scale

Configure the maximum event age and count in **Settings → Storage**. Maintenance runs at startup,
after retention changes, and periodically during capture. It removes expired records, repairs
session counts, and discards malformed stored rows.

PulseRN's acceptance coverage includes a 100,000-event database profile. Live renderer views remain
bounded to 2,000 events, and older records are paged from SQLite.

## Move sessions between computers

Use [session archives](/PulseRN-Site/session-archives/) to export one or more sessions with their
bookmarks and annotations. Use [automatic diagnostics](/PulseRN-Site/diagnostics/) when you want a
deterministic summary of likely failures and their evidence.
