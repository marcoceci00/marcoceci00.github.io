---
title: "Un'app di inventario IT costruita da zero"
description: "Fogli di calcolo e memoria non bastavano più per sapere chi ha quale PC. Così ho costruito una piccola app di inventario con Next.js, PostgreSQL e Drizzle, più uno script PowerShell che raccoglie le specifiche hardware."
date: 2026-10-12
draft: false
---

Quale PC ha ogni persona? Quale vecchio PC ha restituito, e quando? Quali licenze sono in uso, e su cosa? Fino a poco tempo fa la risposta era "fammi controllare", seguita da una ricerca tra email e appunti.

Esistono strumenti già pronti per la gestione degli asset IT, ma volevo qualcosa che si adattasse esattamente al nostro modo di lavorare, e volevo capirne ogni parte. Così ne ho costruito uno.

## Gli strumenti

- **Next.js** con TypeScript, usando Server Components e Server Actions: le pagine leggono dal database sul server, e i moduli inviano i dati direttamente a funzioni sul server. Nessuna API separata da mantenere.
- **PostgreSQL**, in **Docker** sul mio PC.
- **Drizzle ORM** per lo schema, le query e le migrazioni.
- **Tailwind CSS** e **shadcn/ui** per l'interfaccia.

## Far rispettare le regole al database

La scelta di progettazione più importante è stata mettere le regole **nel database**, non solo nel codice. Il codice ha bug, i moduli si possono aggirare, e uno script scritto l'anno prossimo potrebbe dimenticare un controllo. Un vincolo nel database non si può dimenticare.

Un dispositivo è assegnato a una **persona** oppure, per le macchine condivise, a una **divisione**, ma mai a entrambe. È una riga di SQL, scritta con Drizzle:

```ts
check(
  "device_owner_check",
  sql`num_nonnulls(${table.personId}, ${table.divisionId}) <= 1`,
),
```

Le licenze seguono la stessa idea. Alcune sono assegnate a una persona (un abbonamento cloud), altre a una macchina (una licenza perpetua attivata su un PC). Ogni assegnazione deve puntare a **esattamente uno** dei due (`num_nonnulls(...) = 1`), la stessa licenza non può essere assegnata due volte alla stessa persona o allo stesso PC, e il numero di posti deve essere maggiore di zero.

## Uno storico di cui fidarsi

Sapere chi ha un PC *oggi* è solo metà della storia. Volevo sapere anche chi lo aveva prima, e quando è andato in riparazione.

Ogni volta che cambiano lo stato o l'assegnatario di un dispositivo, l'app scrive una nuova riga in una tabella `device_event`: una fotografia dello stato e dell'assegnatario in quel momento. Le righe vengono solo **aggiunte**, mai modificate. La modifica e la riga di storico vengono scritte nella stessa **transazione** del database, quindi o si salvano entrambe o nessuna delle due: lo storico non può mai disallinearsi dallo stato attuale.

## Raccogliere le specifiche con PowerShell

Scrivere a mano CPU, RAM e numeri di serie è lento e porta a errori. Così c'è un piccolo **script PowerShell in sola lettura** che gira su un PC, legge le informazioni hardware che Windows tiene già aggiornate (tramite **CIM/WMI**) e le salva in un file JSON con il nome del computer.

L'app importa quei file e associa ciascuno a un dispositivo:

1. **per numero di serie**, l'identificativo più affidabile;
2. altrimenti **per nome del computer**, che corrisponde al codice di inventario;
3. altrimenti **crea un nuovo dispositivo**, segnato come "in configurazione".

Due dettagli hanno richiesto più riflessione del previsto:

- **Numeri di serie finti.** Molti PC assemblati riportano segnaposto come *"To be filled by O.E.M."* o *"Default string"*. Se contassero come seriali veri, macchine diverse verrebbero fuse in una sola. L'importazione li tratta come assenti.
- **Conflitti.** Se il nome del computer corrisponde a un dispositivo esistente ma il numero di serie è diverso, probabilmente è un PC nuovo che ha ereditato un vecchio nome. Invece di tirare a indovinare, l'importazione **si ferma e segnala un conflitto** da far controllare a una persona.

Visto che il JSON arriva dall'esterno dell'app, ogni campo viene controllato prima dell'uso: tipi, lunghezze, valori sensati.

## Le scelte di sicurezza, per ora

Per ora l'app gira solo sul mio PC. Sia il server web sia il database accettano connessioni solo da `localhost`, quindi niente è raggiungibile dal resto della rete. Visto che non c'è ancora un login, **non salva i codici di licenza**. Il prossimo passo, quando altre persone dovranno accedere, sarà aggiungere l'autenticazione e spostarla su un server.

## Cosa ho imparato

- **I vincoli nel database sono l'ultima linea di difesa**, e la più economica.
- **Uno storico in sola aggiunta più le transazioni** danno una traccia delle modifiche di cui ci si può davvero fidare.
- **I dati reali sono disordinati.** Seriali finti, byte invisibili all'inizio di un file, nomi riusati tra macchine diverse: la maggior parte del lavoro è stata gestire i casi che il "percorso ideale" ignora.
- **Costruire qualcosa che usi tutti i giorni** insegna più in fretta di qualsiasi tutorial: ogni scorciatoia prima o poi torna indietro.
