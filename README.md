# Bellariva — Sartoria Digitale

Piattaforma web per una sartoria su misura: i clienti sfogliano la collezione, configurano capi e accessori in un mini-editor 2D/3D usando le proprie misure corporee, inviano la richiesta di preventivo e negoziano in chat con la sarta. Il lato gestionale copre calendario appuntamenti, ordini, pagamenti, catalogo, magazzino e team.

Progetto sviluppato come lavoro finale per l'esame di [FULL STACK/ Cotini Alessia].

Frontend React di [sartoria-digitale-backend](../sartoria-digitale-backend) (Spring Boot).

## Funzionalità principali

- **Autenticazione a ruoli**: cliente (self-registrazione), sottoposto, sarta, super admin, con permessi differenziati
- **Configuratore 2D/3D**: capi e accessori sovrapposti a un manichino 3D scalato sulle misure del cliente, con scelta di materiale, colore e opzioni
- **Preventivi e chat**: negoziazione in tempo reale (WebSocket/STOMP) tra cliente e sarta prima della conferma ordine
- **Gestionale sarta**: calendario appuntamenti, ordini (online + walk-in), pagamenti (acconto/saldo), catalogo capi/materiali/accessori, magazzino, gestione team
- **Reset password** via email (Mailgun)
- **i18n** italiano/inglese e tema chiaro/scuro

## Stack tecnico

React 19, Redux Toolkit, React Router 7, React Bootstrap, react-i18next, Three.js (manichino 3D), @stomp/stompjs (chat real-time), Vite.

## Avvio in locale

Prerequisiti: Node.js, backend [sartoria-digitale-backend](../sartoria-digitale-backend) in esecuzione su `localhost:3027`.

```bash
npm install
npm run dev
```
