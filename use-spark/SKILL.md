---
name: use-spark
description: >-
  Use the spark CLI to access the user's Spark email data - list emails,
  search by topic, read threads, check calendar events, find availability,
  look up contacts, and view team info. Use when the user asks about their
  emails, calendar, contacts, meetings, or scheduling.
metadata:
  version: 1.3.1
  requires:
    bins:
      - spark
---

# spark

Thin CLI talking over IPC to the user's running Spark Desktop app. It only works on the
user's machine: never a sandbox, container or CI runner. If it can't connect, ask the user
to launch Spark Desktop instead of retrying.

**Run `spark help <cmd>` before the first use of a command.** Every flag, filter operator,
date format and action name is documented there. Do not guess them.

## Quick start

```bash
spark emails --limit 20                            # unified inbox, most recent first
spark emails aurelien@example.com --limit 20       # one account's inbox
spark emails --filter "is:unread newer_than:7d"    # unread from the last week
spark search "hotel booking"                       # semantic search, returns bodies
spark thread 9918                                  # full text of a thread, by id
spark events --today                               # calendar
```

Ids in the `ID` column of `emails` / `search` are what `thread`, `draft --reply-to` and
`action` take.

## Commands

Read: `accounts` `folders` `emails` `search` `thread` `attachment` `templates` `template`
`events` `availability` `contacts` `team` `meetings` `meeting`

Write: `draft` `comment` `event` `action` `contact-action`

- `emails` filters by metadata (Gmail-style `--filter`), `search` does semantic topic
  search and returns full bodies. Ids from either feed `thread <id>`.
- `action` acts on emails, `contact-action` on a sender and applies to future mail too.
  Both take an action name: `spark help action` lists them.
- `event create|update|delete|rsvp`; `draft` covers new, reply, forward and templates.

## Notes

- After `draft` / `comment`, hand the user the `Link:` from the output as a clickable
  markdown link rather than telling them to open Spark.
- Unknown command or flag? If `spark --version` is above `metadata.version` above, this
  file is stale: `spark skill > <path of this file>` to refresh it.
