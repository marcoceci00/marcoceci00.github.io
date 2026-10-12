---
title: "Ping works, the web page doesn't: debugging a firewall between subnets"
description: "A device answered ping from another subnet, but its web interface never loaded. How I proved where the problem was and asked for exactly the right firewall rule."
date: 2026-10-12
draft: false
---

A colleague reported that the web interface of an internal device would not open from their PC. The strange part: from their PC, the device answered `ping` without any problem.

## The symptom

- From PCs on the **same subnet** as the device, the web interface opened fine.
- From PCs on **another subnet**, `ping` worked, but the browser waited and then timed out.

If ping works, the network is "up", right? Not quite.

## Step 1: rule out the obvious

First I checked the PC's network settings with `ipconfig`: correct IP address, correct subnet mask, correct gateway. The PC was in the subnet it was supposed to be in. So this was not a misconfigured client.

## Step 2: test the port, not just the host

`ping` uses **ICMP**, a different protocol from the one the web page uses (**TCP**, port 80 for HTTP). A firewall can allow one and block the other. So I tested the actual port with PowerShell:

```powershell
Test-NetConnection 10.0.10.50 -Port 80
```

The result:

```text
PingSucceeded    : True
TcpTestSucceeded : False
```

That is the whole story in two lines: the host is reachable, the service is not. *(The addresses in this post are examples.)*

## The cause

Traffic between two different subnets goes through the **firewall**; traffic inside the same subnet does not. That's why the page worked for PCs next to the device and failed for everyone else. The firewall rules allowed ICMP between the two subnets, but not TCP port 80.

## The fix

The firewall is managed by an external provider, so I sent them a precise request:

- **from:** the second subnet
- **to:** that one device only
- **port:** TCP 80 only

I attached the `Test-NetConnection` output as evidence. Asking for exactly what is needed, and nothing more, is the **principle of least privilege**: opening "everything between the two subnets" would also have worked, but it would have exposed much more than one web page.

The provider added the rule the same day, and the page opened from the second subnet.

## What I learned

- **A successful ping does not mean a service is reachable.** Firewalls filter by protocol and port.
- **`Test-NetConnection -Port` is the right tool** on Windows to check a specific service.
- **Evidence makes requests faster.** A provider can act on "TCP 80 from subnet A to host B fails, here is the test" immediately. "It doesn't work" starts a long conversation.
