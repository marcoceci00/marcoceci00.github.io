---
title: "'Autore sconosciuto': cosa significa davvero un'app non firmata su un PC aziendale"
description: "Un utente ha trovato un'app chiamata 'update-server' senza autore. Cosa ci dice la mancanza di una firma digitale, come verificarla e cosa fare dopo aver rimosso l'app."
date: 2026-10-08
draft: false
---

Un utente ha notato qualcosa di strano nell'elenco delle app installate: un programma chiamato **update-server**, con l'autore indicato come **sconosciuto**. Non aveva installato niente con quel nome.

## Cosa significa "autore sconosciuto"

La maggior parte del software per Windows è **firmato digitalmente**. Lo sviluppatore firma il programma con un certificato rilasciato da un'autorità riconosciuta, e Windows può così verificare due cose:

- **chi** lo ha pubblicato (il nome nel certificato);
- che il file **non è stato modificato** dopo la firma.

Quando Windows mostra "autore sconosciuto", il programma **non ha una firma valida**. Questo non lo rende automaticamente un malware: molti produttori piccoli o poco attenti non firmano i loro strumenti. Ma significa che **nessuno garantisce da dove venga**, e basta questo per guardarci meglio.

## Come verificare una firma da solo

Da Esplora file: tasto destro sul file `.exe` → **Proprietà** → scheda **Firme digitali**. Se la scheda non c'è, il file non è firmato.

Da PowerShell:

```powershell
Get-AuthenticodeSignature "C:\percorso\programma.exe" | Format-List Status, SignerCertificate
```

Quello che vuoi vedere è `Status : Valid` con un autore riconoscibile. `NotSigned` (non firmato) o `HashMismatch` (firmato, ma modificato dopo la firma) sono i campanelli d'allarme.

## Cos'era in realtà

Il programma si trovava in una cartella con il nome di un servizio cloud per telecamere domestiche. La spiegazione più probabile era un componente di aggiornamento installato insieme a un'app per vedere le telecamere, non qualcosa di malevolo. Comunque, un servizio non firmato che gira in background con accesso alla rete non ha motivo di stare su un PC aziendale, quindi l'ho disinstallato.

## Dopo averlo rimosso

Disinstallare l'app è solo metà del lavoro. Se *era* qualcosa di indesiderato, potrebbe aver lasciato altri pezzi:

1. **Esegui una scansione antivirus completa** (Microsoft Defender basta per un primo controllo).
2. **Controlla le app di avvio**: Gestione attività → **App di avvio**, e cerca voci che non riconosci.
3. **Controlla le attività pianificate**, nel caso qualcosa la reinstalli o la riavvii.
4. **Controlla le estensioni del browser**, un nascondiglio frequente per il software indesiderato.

## Cosa ho imparato

- **Una firma mancante è una domanda, non un verdetto.** Ti dice di indagare, non che il programma è malevolo.
- **Le firme si verificano in pochi secondi**, con la finestra Proprietà o con `Get-AuthenticodeSignature`.
- **Su un PC aziendale, "probabilmente innocuo" non basta.** Un software che nessuno può garantire e che a nessuno serve va tolto.
