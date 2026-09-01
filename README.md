# Bellariva — Sartoria Digitale

Piattaforma web per una sartoria su misura: i clienti sfogliano la collezione, configurano capi e accessori in un mini-editor 2D/3D usando le proprie misure corporee, inviano la richiesta di preventivo e negoziano in chat con la sarta. Il lato gestionale copre calendario appuntamenti, ordini, pagamenti, catalogo, magazzino e team.

Progetto sviluppato come lavoro finale per l'esame di FULL STACK / Cotini Alessia.

Frontend React di [sartoria-digitale-backend](../sartoria-digitale-backend) (Spring Boot).

## Demo online

- **Frontend**: https://sartoria-digitale-frontend.vercel.app
- **Backend**: https://sartoria-digitale-backend.onrender.com

> Il backend è ospitato su Render — un monitor UptimeRobot lo tiene sveglio con un ping ogni 5 minuti, quindi non dovrebbe più andare in sleep. In caso di prima richiesta molto lenta, attendere qualche secondo.

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

Crea un file `.env` nella root con:

```properties
VITE_API_URL=http://localhost:3027
```

npm install
npm run dev

Deploy
Hosting su Vercel (build Vite standard, npm run build). Variabile d'ambiente richiesta:

VITE_API_URL — URL pubblico del backend
Il file vercel.json nella root contiene il rewrite necessario per far funzionare il routing di React Router su URL diretti/ricaricati:

{
"rewrites": [
{ "source": "/(.*)", "destination": "/index.html" }
]
}
