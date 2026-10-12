---
title: "Outlook doesn't show old emails, but Outlook on the web does"
description: "Older messages were missing in the Outlook desktop app but visible in the browser. The cause is one setting: how much of the mailbox Outlook keeps offline."
date: 2026-10-12
draft: true
---

A user told me their older emails had "disappeared" from Outlook. Nothing had been deleted: the same messages were all there in **Outlook on the web**. Only the desktop app was missing them.

When something is visible in the browser but not in the app, the data is fine. The difference is in **where each one reads from**.

## Two ways of reading the same mailbox

- **Outlook on the web** reads directly from the mail server. It always shows the whole mailbox.
- **The Outlook desktop app**, with an Exchange or Microsoft 365 account, normally works in **Cached Exchange Mode**: it keeps a local copy of the mailbox in an `.ost` file on the PC. It's what makes Outlook fast and lets it work offline.

That local copy doesn't have to contain everything. A setting called **Mail to keep offline** decides how far back it goes: 3 months, 1 year, 5 years, All. Depending on the version and the disk size, the default is often **1 year**. Anything older stays on the server, and the app only shows a link at the bottom of the folder to fetch it.

That was exactly the case here: the slider was not set to **All**.

## The fix (classic Outlook)

1. **File → Account Settings → Account Settings…**
2. Select the Exchange / Microsoft 365 account and click **Change…**
3. Move the **Mail to keep offline** slider to **All**.
4. Click **Next**, then **Done**, and restart Outlook.

Outlook then downloads the older messages in the background. With a large mailbox this can take a while, and the `.ost` file grows accordingly, so check the free disk space first.

In the **new Outlook for Windows** the equivalent option is under **Settings → General → Offline**.

If the slider is greyed out, the setting is enforced by a company policy (Group Policy or Intune). In that case, the change has to be made by whoever manages that policy.

## What I learned

- **"Missing in the app, present on the web" almost always points to the local cache**, not to lost data.
- **Cached mode is a trade-off**: a smaller local copy saves disk space and speeds up sync, but older mail is only one click away instead of always there.
- **Check the simple setting before rebuilding anything.** Recreating the profile or deleting the `.ost` would have taken much longer and fixed nothing.
