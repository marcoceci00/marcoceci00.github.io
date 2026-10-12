---
title: "Il ping risponde, la pagina web no: un firewall tra due sottoreti"
description: "Un dispositivo rispondeva al ping da un'altra sottorete, ma la sua interfaccia web non si apriva mai. Come ho dimostrato dov'era il problema e chiesto esattamente la regola firewall giusta."
date: 2026-10-09
draft: false
---

Un collega mi ha segnalato che dal suo PC non si apriva l'interfaccia web di un dispositivo interno. La cosa strana: dal suo PC il dispositivo rispondeva al `ping` senza problemi.

## Il sintomo

- Dai PC nella **stessa sottorete** del dispositivo, l'interfaccia web si apriva senza problemi.
- Dai PC di **un'altra sottorete**, il `ping` funzionava, ma il browser restava in attesa e poi andava in timeout.

Se il ping risponde, la rete funziona, giusto? Non proprio.

## Passo 1: escludere le cose ovvie

Per prima cosa ho controllato le impostazioni di rete del PC con `ipconfig`: indirizzo IP, subnet mask e gateway erano corretti. Il PC era nella sottorete in cui doveva essere, quindi non era un problema di configurazione del client.

## Passo 2: testare la porta, non solo l'host

Il `ping` usa **ICMP**, un protocollo diverso da quello che usa la pagina web (**TCP**, porta 80 per l'HTTP). Un firewall può lasciar passare uno e bloccare l'altro. Così ho testato la porta vera e propria con PowerShell:

```powershell
Test-NetConnection 10.0.10.50 -Port 80
```

Il risultato:

```text
PingSucceeded    : True
TcpTestSucceeded : False
```

In queste due righe c'è tutta la storia: l'host è raggiungibile, il servizio no. *(Gli indirizzi in questo articolo sono di esempio.)*

## La causa

Il traffico tra due sottoreti diverse passa dal **firewall**; quello all'interno della stessa sottorete no. Per questo la pagina funzionava per i PC vicini al dispositivo e non per tutti gli altri. Le regole del firewall lasciavano passare l'ICMP tra le due sottoreti, ma non il TCP sulla porta 80.

## La soluzione

Il firewall è gestito da un fornitore esterno, quindi gli ho mandato una richiesta precisa:

- **da:** la seconda sottorete
- **verso:** solo quel dispositivo
- **porta:** solo TCP 80

Ho allegato il risultato di `Test-NetConnection` come prova. Chiedere esattamente quello che serve, e niente di più, è il **principio del minimo privilegio**: aprire "tutto tra le due sottoreti" avrebbe funzionato lo stesso, ma avrebbe esposto molto più di una pagina web.

Il fornitore ha aggiunto la regola in giornata, e la pagina si è aperta anche dalla seconda sottorete.

## Cosa ho imparato

- **Un ping che risponde non vuol dire che il servizio sia raggiungibile.** I firewall filtrano per protocollo e porta.
- **`Test-NetConnection -Port` è lo strumento giusto** su Windows per verificare un servizio specifico.
- **Le prove velocizzano le richieste.** Un fornitore può agire subito su "il TCP 80 dalla sottorete A all'host B non passa, ecco il test". "Non funziona" apre invece una lunga conversazione.
