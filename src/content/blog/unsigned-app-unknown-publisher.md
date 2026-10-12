---
title: "'Unknown publisher': what an unsigned app on a work PC really means"
description: "A user found an app called 'update-server' with no publisher. Here is what a missing digital signature tells you, how to check it, and what to do after removing the app."
date: 2026-10-12
draft: true
---

A user noticed something odd in their list of installed apps: a program called **update-server**, with the publisher listed as **unknown**. They hadn't installed anything with that name.

## What "unknown publisher" means

Most Windows software is **digitally signed**. The developer signs the program with a certificate issued by a trusted authority, and Windows can then verify two things:

- **who** published it (the name in the certificate);
- that the file **has not been modified** since it was signed.

When Windows shows "unknown publisher", the program has **no valid signature**. That doesn't automatically make it malware: plenty of small or careless vendors don't sign their tools. But it means **nobody guarantees where it came from**, and that is reason enough to look closer.

## How to check a signature yourself

From File Explorer: right-click the `.exe` → **Properties** → **Digital Signatures** tab. If the tab is missing, the file is not signed.

From PowerShell:

```powershell
Get-AuthenticodeSignature "C:\path\to\program.exe" | Format-List Status, SignerCertificate
```

`Status : Valid` with a recognisable publisher is what you want to see. `NotSigned` or `HashMismatch` (signed, but modified afterwards) are the red flags.

## What it turned out to be

The program lived in a folder named after a consumer cloud-camera service. The most likely explanation was an update component installed together with a camera viewer app, not something malicious. Still, an unsigned background service with network access has no place on a company PC, so I uninstalled it.

## After removing it

Uninstalling the app is only half the job. If it *was* something unwanted, it may have left other pieces behind:

1. **Run a full antivirus scan** (Microsoft Defender is enough for a first check).
2. **Check startup apps**: Task Manager → **Startup apps**, and look for unfamiliar entries.
3. **Check scheduled tasks** for anything that re-installs or launches it.
4. **Check browser extensions**, a common place for unwanted software to hide.

## What I learned

- **A missing signature is a question, not a verdict.** It tells you to investigate, not that the program is malicious.
- **Signatures can be checked in seconds**, with the Properties window or `Get-AuthenticodeSignature`.
- **On a work PC, "probably harmless" isn't enough.** Software that nobody can vouch for and nobody needs should go.
