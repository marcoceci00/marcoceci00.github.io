---
title: "Outlook non mostra le email vecchie, ma Outlook sul web sì"
description: "Nell'app di Outlook mancavano i messaggi più vecchi, che invece si vedevano nel browser. La causa è una sola impostazione: quanta parte della casella Outlook tiene offline."
date: 2026-10-09
draft: false
---

Un utente mi ha detto che le sue email più vecchie erano "sparite" da Outlook. Non era stato cancellato niente: gli stessi messaggi c'erano tutti su **Outlook sul web**. Mancavano solo nell'app desktop.

Quando qualcosa si vede nel browser ma non nell'app, i dati sono a posto. La differenza sta in **da dove legge ciascuno dei due**.

## Due modi di leggere la stessa casella

- **Outlook sul web** legge direttamente dal server di posta. Mostra sempre tutta la casella.
- **L'app Outlook desktop**, con un account Exchange o Microsoft 365, di solito lavora in **modalità cache di Exchange**: tiene sul PC una copia locale della casella, in un file `.ost`. È ciò che rende Outlook veloce e gli permette di funzionare anche offline.

Quella copia locale non deve per forza contenere tutto. Un'impostazione chiamata **Posta da mantenere offline** decide fin dove arriva: 3 mesi, 1 anno, 5 anni, Tutto. A seconda della versione e della dimensione del disco, il valore predefinito è spesso **1 anno**. Tutto ciò che è più vecchio resta sul server, e l'app mostra solo un link in fondo alla cartella per scaricarlo.

Era proprio questo il caso: il cursore non era su **Tutto**.

## La soluzione (Outlook classico)

1. **File → Impostazioni account → Impostazioni account…**
2. Seleziona l'account Exchange / Microsoft 365 e clicca **Cambia…**
3. Sposta il cursore **Posta da mantenere offline** su **Tutto**.
4. Clicca **Avanti**, poi **Fine**, e riavvia Outlook.

Outlook scarica poi i messaggi più vecchi in background. Con una casella grande può volerci un po', e il file `.ost` cresce di conseguenza: controlla prima lo spazio libero sul disco.

Nel **nuovo Outlook per Windows** l'opzione equivalente si trova in **Impostazioni → Generale → Offline**.

Se il cursore è disattivato (grigio), l'impostazione è imposta da una regola aziendale (Criteri di gruppo o Intune). In quel caso la modifica va fatta da chi gestisce quella regola.

## Cosa ho imparato

- **"Manca nell'app, c'è sul web" indica quasi sempre la cache locale**, non dati persi.
- **La modalità cache è un compromesso**: una copia locale più piccola risparmia spazio e velocizza la sincronizzazione, ma la posta vecchia è a un clic di distanza invece di essere sempre lì.
- **Controlla l'impostazione semplice prima di ricostruire qualcosa.** Ricreare il profilo o cancellare il file `.ost` avrebbe richiesto molto più tempo e non avrebbe risolto niente.
