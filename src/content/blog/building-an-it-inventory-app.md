---
title: "Building an IT inventory app from scratch"
description: "Spreadsheets and memory weren't enough to track who has which PC. So I built a small inventory app with Next.js, PostgreSQL and Drizzle, plus a PowerShell script that collects hardware specs."
date: 2026-10-12
draft: false
---

Which PC does each person have? Which old one did they hand back, and when? Which licences are in use, and on what? Until recently the answer was "let me check", followed by a search through emails and notes.

There are ready-made IT asset management tools, but I wanted something that fits exactly how we work, and I wanted to understand every part of it. So I built one.

## The stack

- **Next.js** with TypeScript, using Server Components and Server Actions: the pages read from the database on the server, and forms post straight to server functions. No separate API to maintain.
- **PostgreSQL**, running in **Docker** on my machine.
- **Drizzle ORM** for the schema, queries and migrations.
- **Tailwind CSS** and **shadcn/ui** for the interface.

## Let the database enforce the rules

The most important design decision was to put the business rules **in the database**, not only in the code. Code has bugs, forms can be bypassed, and a script written next year might forget a check. A database constraint can't be forgotten.

A device is assigned either to a **person** or, for shared machines, to a **division**, but never to both. That's one line of SQL, written with Drizzle:

```ts
check(
  "device_owner_check",
  sql`num_nonnulls(${table.personId}, ${table.divisionId}) <= 1`,
),
```

Licences follow the same idea. Some are assigned to a person (a cloud subscription), some to a machine (a perpetual licence activated on one PC). Each assignment must point to **exactly one** of the two (`num_nonnulls(...) = 1`), the same licence can't be assigned twice to the same person or PC, and the number of seats must be greater than zero.

## History you can trust

Knowing who has a PC *today* is only half the story. I also wanted to know who had it before, and when it went in for repair.

Every time a device's status or assignee changes, the app writes a new row to a `device_event` table: a snapshot of the status and the assignee at that moment. Rows are only ever **added**, never edited. The update and the history row are written in the same **database transaction**, so either both are saved or neither is: the history can never drift out of sync with the current state.

## Collecting specs with PowerShell

Typing CPU, RAM and serial numbers by hand is slow and error-prone. So there's a small **read-only PowerShell script** that runs on a PC, reads the hardware information Windows already keeps (through **CIM/WMI**), and saves it as a JSON file named after the computer.

The app imports those files and matches each one to a device:

1. **by serial number**, the most reliable identifier;
2. otherwise **by computer name**, which matches the inventory code;
3. otherwise it **creates a new device**, marked as "being set up".

Two details took more thought than expected:

- **Fake serial numbers.** Many custom-built PCs report placeholders like *"To be filled by O.E.M."* or *"Default string"*. If those counted as real serials, different machines would be merged into one. The importer treats them as missing.
- **Conflicts.** If a computer name matches an existing device but the serial number is different, it's probably a new PC that inherited an old name. Instead of guessing, the importer **stops and reports a conflict** for a person to check.

Because the JSON comes from outside the app, every field is validated before use: types, lengths, sensible ranges.

## Security choices, for now

The app currently runs only on my machine. Both the web server and the database listen on `localhost` only, so nothing is reachable from the rest of the network. Since there's no login yet, it **doesn't store licence keys**. Adding authentication and moving it to a server are the next step, once more people need access.

## What I learned

- **Constraints in the database are the last line of defence**, and the cheapest one.
- **Append-only history plus transactions** gives you an audit trail you can actually rely on.
- **Real-world data is messy.** Fake serial numbers, invisible bytes at the start of a file, names reused across machines: most of the work was handling the cases the "happy path" ignores.
- **Building something you use every day** teaches faster than any tutorial: every shortcut comes back to you.
