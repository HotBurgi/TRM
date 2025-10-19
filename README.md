# TRM – The Real Manager

## Introduzione

**TRM (The Real Manager)** è un progetto realizzato in due settimane, con l’obiettivo di creare un gestionale per la gestione dei task semplice, chiaro e veloce da usare.  
È pensato per team di sviluppo, aziende o professionisti che vogliono organizzare il proprio lavoro in modo più efficiente, senza la complessità di strumenti troppo pesanti come Trello o Jira.

L’idea è nata dalla necessità di avere una piattaforma leggera, personalizzabile e facilmente adattabile a diversi tipi di progetti.  
L’interfaccia è stata progettata in Figma e poi sviluppata con **Svelte**, **HTML** e **DaisyUI**.

---

## Obiettivi del progetto

L’obiettivo principale era sviluppare una web app in grado di:
- Visualizzare i task in modo ordinato e intuitivo.
- Gestire lo stato di avanzamento del lavoro (Backlog → In Progress → Review → Done).
- Permettere l’assegnazione e la priorità dei compiti.
- Offrire un’interfaccia responsive, adatta sia a desktop che a mobile.
- Garantire affidabilità e semplicità d’uso.

Il tutto utilizzando un approccio moderno, open source e facilmente estendibile.

---

## Analisi dei requisiti

### Requisiti funzionali
1. **Gestione dei task:** creazione, modifica, eliminazione e spostamento tra le varie fasi del flusso di lavoro.  
2. **Assegnazione:** ogni task può essere assegnato a uno o più membri del team.  
3. **Sistema di priorità:** ogni attività ha un livello (Urgent, Medium, Low, None) per indicare l’importanza.  
4. **Ricerca e filtri:** possibilità di filtrare i task per stato, priorità o assegnatario.  
5. **Gestione delle issue:** i bug o le segnalazioni possono essere inseriti e gestiti come task normali.  
6. **Dashboard riepilogativa:** mostra in tempo reale il numero di task per ogni colonna e lo stato generale del progetto.

### Requisiti non funzionali
- **Usabilità:** interfaccia pulita, chiara e coerente.  
- **Prestazioni:** caricamento veloce e navigazione fluida.  
- **Sicurezza:** autenticazione e protezione dei dati.  
- **Affidabilità:** salvataggio stabile e gestione sicura dei task.  
- **Portabilità:** accesso da qualsiasi browser moderno.  
- **Scalabilità:** struttura pensata per futuri ampliamenti.

### Requisiti di dominio
Il sistema segue la logica **Kanban**, con la visualizzazione dei task come “card” che si spostano da uno stato all’altro, facilitando la collaborazione e la tracciabilità del lavoro.

### Requisiti di vincolo
- **Tecnologie:** Svelte per la logica, HTML per la struttura e DaisyUI per la grafica.  
- **Tempo di sviluppo:** due settimane.  
- **Licenza:** open source, senza costi.  
- **Compatibilità:** funziona su tutti i principali browser (Chrome, Edge, Firefox, Safari).

---

## Design e interfaccia utente

Il design è ispirato al modello Kanban e suddivide i task in quattro colonne principali:
- **Backlog:** attività pianificate ma non iniziate.  
- **In Progress:** attività in lavorazione.  
- **Review:** attività in revisione o controllo.  
- **Done:** attività completate.

Ogni card mostra titolo, descrizione, priorità e assegnatario.  
Il layout è stato realizzato su **Figma** e successivamente implementato con **Svelte**.  
Il risultato è un’interfaccia semplice, moderna e facile da comprendere anche per chi non è esperto.

---

## Analisi della concorrenza

Durante la fase di analisi abbiamo studiato strumenti come **Trello**, **Jira**, **Asana** e **Notion**.  
Abbiamo notato che, sebbene offrano molte funzioni, risultano spesso complessi per piccoli team o progetti più semplici.  
TRM vuole essere un’alternativa leggera, veloce e personalizzabile, con un’interfaccia pulita e senza elementi superflui.

---

## Analisi di fattibilità

- **Tecnica:** il progetto è stato realizzato interamente con tecnologie moderne e accessibili, quindi facilmente mantenibile.  
- **Economica:** non ci sono costi, essendo tutto open source.  
- **Operativa:** l’app è funzionante e utilizzabile da qualsiasi utente, senza installazioni particolari.

---

## Sviluppo e fasi del progetto

1. Analisi dei requisiti e definizione delle funzionalità principali.  
2. Realizzazione del mockup su Figma.  
3. Sviluppo dell’interfaccia con HTML, Svelte e DaisyUI.  
4. Integrazione della logica di gestione dei task.  
5. Test e ottimizzazione delle funzionalità.  
6. Rifinitura grafica e presentazione del progetto.

---

## Struttura del team

| Nome      | Ruolo              | Competenze principali                      |
|------------|--------------------|--------------------------------------------|
| Federico   | Project Manager    | Pianificazione, UI/UX, Svelte, DaisyUI |
| Mattia     | Frontend Developer | HTML, Svelte, JavaScript, gestione repository |
| Davide     | Backend Developer  | Gestione logica progetto, Svelte, HTML, JS  |

---

## Allegati

- [Mockup interfaccia (Iniziale)](mockup.png)
- [Mockup interfaccia (Figma)](mockup_2.0.jpg)

---

## build

### Installazione delle dipendenze
```
npm install
```
### Build del progetto
```
npm run build
```
### Creazione immagine docker
```
docker build -t trm:latest .
```
### Avvio immagine
```
docker run --rm -p 80:80 --name trm trm:latest
```

--

## Conclusione

**TRM – The Real Manager** è un progetto completo e funzionante, sviluppato in due settimane.  
Nasce dall’idea di semplificare la gestione dei task mantenendo un design moderno e un’esperienza d’uso intuitiva.  
Il risultato è una piattaforma leggera ma efficace, pensata per chi vuole organizzare e monitorare il proprio lavoro in modo pratico e immediato.
