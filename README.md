# TRM – The Real Manager

## Introduzione

TRM (The Real Manager) è un progetto nato con l’obiettivo di creare un sistema di gestione dei task semplice, intuitivo e personalizzabile, pensato per team di sviluppo, aziende e professionisti che necessitano di un gestionale pratico per l’organizzazione del lavoro quotidiano.

L’idea prende spunto da strumenti noti come Trello e Jira, ma mira a offrire un approccio più diretto, con un’interfaccia pulita, la possibilità di adattarsi a diversi contesti e un’architettura facilmente estendibile.  

---

## Obiettivi del progetto

L’obiettivo principale è realizzare una web application per la gestione delle attività e dei progetti, che consenta di:

- Visualizzare le attività secondo il flusso di lavoro (Backlog → In Progress → Review → Done).
- Gestire le priorità e gli assegnatari.
- Offrire un’interfaccia responsive, accessibile da dispositivi desktop e mobile.
- Fornire statistiche di avanzamento e strumenti di ricerca interni.
- Garantire sicurezza, affidabilità e facilità d’uso.

Il progetto è pensato per essere sviluppato in ambiente **Svelt**, utilizzando tecnologie moderne e strumenti open source.

---

## Analisi dei requisiti

La definizione dei requisiti rappresenta una delle fasi più importanti nello sviluppo del progetto, in quanto serve a tradurre i bisogni degli utenti in funzionalità concrete.  
Di seguito sono riportate le principali categorie di requisiti individuate.

### Requisiti funzionali

1. **Gestione dei task**
   - Creazione, modifica e eliminazione di attività.
   - Possibilità di spostare i task tra diverse colonne (stati del flusso di lavoro).
   - Visualizzazione immediata dello stato e della priorità.

2. **Assegnazione e collaborazione**
   - Ogni task può essere assegnato a uno o più membri del team.
   - Possibilità di commentare o aggiornare le attività con note brevi.

3. **Sistema di priorità**
   - Ogni attività è contrassegnata da un livello di priorità (Urgent, Medium, Low, None).
   - I livelli di priorità influenzano l’ordine di visualizzazione e i filtri.

4. **Ricerca e filtraggio**
   - Barra di ricerca per titolo, descrizione o assegnatario.
   - Filtri per stato, priorità o data di creazione.

5. **Gestione delle issue**
   - Funzione per segnalare bug, problemi o richieste di miglioramento.
   - Ogni issue può essere classificata e monitorata come un normale task.

6. **Dashboard riepilogativa**
   - Contatori automatici per ogni colonna (Backlog, In Progress, Review, Done).
   - Visualizzazione dello stato generale del progetto.

### Requisiti non funzionali

- **Usabilità:** interfaccia semplice e coerente, progettata per ridurre il tempo di apprendimento.
- **Prestazioni:** caricamento della board entro 2 secondi e interazioni fluide anche con molti task.
- **Sicurezza:** autenticazione sicura e protezione contro accessi non autorizzati.
- **Affidabilità:** salvataggio automatico delle modifiche, riduzione dei rischi di perdita dati.
- **Portabilità:** accessibile da qualsiasi dispositivo tramite browser.
- **Scalabilità:** architettura predisposta per evoluzioni future.

### Requisiti di dominio

Il progetto si ispira ai principi dei metodi agili (in particolare **Kanban**), dove ogni attività viene rappresentata come una card che attraversa diverse fasi fino al completamento.  
Il sistema deve quindi supportare:
- la collaborazione in team,
- la tracciabilità delle modifiche,
- la possibilità di visualizzare in tempo reale lo stato di avanzamento del lavoro.

### Requisiti di vincolo

- **Tecnologie:** Svelt JavaScript per la logica del porgetto e html per lo scheltro del progetto e tailwind per la grafica .
- **Vincoli temporali:** sviluppo previsto in circa due settimane.
- **Vincoli economici:** progetto open source, senza costi di licenza.
- **Compatibilità:** funzionamento garantito su browser recenti (Chrome, Edge, Firefox, Safari).

---

## Design e interfaccia utente

Il design, realizzato inizialmente su Figma, si ispira al modello Kanban e presenta una suddivisione chiara in quattro colonne principali:
- **Backlog:** attività pianificate ma non ancora iniziate;
- **In Progress:** attività in corso di lavorazione;
- **Review:** attività in revisione o in fase di controllo qualità;
- **Done:** attività completate.

Ogni card include titolo, descrizione, priorità, assegnatario e pulsanti di azione.  
Sono inoltre presenti pulsanti per spostare o eliminare le attività, e un contatore automatico che mostra in tempo reale il numero di task per stato.

*(L’immagine allegata rappresenta un prototipo modificato su Figma che illustra la logica generale dell’interfaccia.)*

---

## Analisi della concorrenza

Prima della progettazione, sono stati analizzati strumenti esistenti (Trello, Jira, Asana, Notion) per valutarne punti di forza e debolezza.  
I principali limiti riscontrati sono stati la complessità delle interfacce e la difficoltà di personalizzazione per team di piccole dimensioni.  
TRM mira a colmare questa lacuna offrendo una soluzione più leggera, veloce e completamente adattabile alle proprie esigenze operative.

---

## Analisi di fattibilità

- **Fattibilità tecnica:** elevata, grazie all’utilizzo di tecnologie mature e ampiamente documentate.
- **Fattibilità economica:** sostenibile, essendo un progetto open source.
- **Fattibilità operativa:** l’interfaccia intuitiva e la struttura modulare permettono una facile adozione da parte degli utenti.

---

## Pianificazione e fasi di sviluppo

1. Analisi dei requisiti e progettazione concettuale.
2. Prototipazione grafica (mockup su Figma).
3. Implementazione del frontend e del backend.
4. Integrazione e test delle funzionalità principali.
5. Validazione con utenti di prova e correzione dei bug.
6. Rilascio della versione beta pubblica.

---

## Struttura del team

| Nome      | Ruolo                | Competenze principali                    |
|------------|----------------------|------------------------------------------|
| Federico      | Project Manager      | Pianificazione, UI/UX, Tailwind CSS, Svelt  |
| Mattia      | Frontend Developer   | Gestione repository,Html, Svelt, Js      |
| Davide   | Backend Developer    | Gestione e revisione del progetto Svelt,Html, Js        |

---

## Allegati

- [Analisi dei requisiti (PDF)](./Dettagli_analisi_requisiti.pdf)
- [Mockup interfaccia (Figma)](./4f2f3014-77ac-4b8f-9fea-58979a704ad7.png)

---

## Conclusione

TRM – The Real Manager nasce con l’intento di coniugare semplicità e funzionalità, proponendo un sistema di gestione dei task moderno, accessibile e facilmente personalizzabile.  
Il progetto è ancora in fase di sviluppo, ma si propone come base solida per la creazione di un gestionale flessibile, pensato per chi vuole gestire il proprio lavoro in modo efficiente e senza complicazioni superflue.
