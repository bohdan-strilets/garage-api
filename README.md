<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" />
  <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black" />
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" />
</p>

# Garage API

**Backend for Garage APP** — an application for vehicle tracking, expenses, and reminders.  
Target market: **Poland**  
UI languages: **pl-PL**, **uk-UA**, **en-US**  
Repository: [garage-api](https://github.com/bohdan-strilets/garage-api)

---

## 🚀 Tech Stack

- NestJS (TypeScript)
- MongoDB
- JWT (access + refresh)
- i18n (pl, ua, en)
- Docker (future deployment)
- ESLint + Prettier
- Swagger (OpenAPI)
- GitHub Actions (CI)

---

## 📦 Project Structure

- `src/` — NestJS source code
- `modules/` — domain modules (auth, users, vehicles, events, documents, places…)
- `docs/` — documentation (`api-guidelines.md`, `i18n.md`, `env.md`, glossary)
- `dist/` — compiled JS (ignored in git)

---

## 🔑 Core Modules

- **Auth & Users** — registration, login, refresh tokens, profile, localization.
- **Vehicles** — garage, vehicle data.
- **Events** — unified log (fuel-ups, service, expenses, fines, parking, EV charging).
- **Media** — attachments (receipts, photos).
- **Documents** — OC/AC/NNW, Zielona Karta, badanie techniczne (deadlines & reminders).
- **Maintenance** — service rules & reminders (3–2–1 inspection logic).
- **Places** — “phonebook” of services, inspection stations, fuel stations, etc.
- **Notifications** — reminder queue.
- **Analytics & Export** — expenses, top places, fuel consumption, CSV export.

---

## ⚙️ Getting Started

### Requirements

- Node.js >= 20
- npm or yarn
- MongoDB (local or Docker)

### Installation

```bash
git clone https://github.com/bohdan-strilets/garage-api
cd garage-api
npm install
```

### Environment Variables

Create a `.env` file in the root.  
Minimum:

```
MONGO_URI=mongodb://localhost:27017/garage
JWT_SECRET=your_secret
PORT=3000
```

Details: [`/docs/env.md`](./docs/env.md).

### Scripts

- `npm run start:dev` — start in development mode
- `npm run build` — build the project
- `npm run start:prod` — run compiled code
- `npm run lint` — run linter
- `npm run format` — format code

---

## 📖 Documentation

- **API checklists & web form scenarios:** [garage-api-web-checklists.md](../garage-api-web-checklists.md)
- **Project plan:** [garage-app-project-plan.md](../garage-app-project-plan.md)
- Swagger/OpenAPI is generated automatically at runtime (`/api/docs`).

---

## ✅ Definition of Done (DoD)

- Clean build (`npm run build`) without errors.
- All endpoints validate input data.
- Unified error format (`{message, details}`).
- `/health` and `/ready` endpoints working.
- Environment variables documented.

---

## 📌 Roadmap

See [Project Plan](../garage-app-project-plan.md), key milestones:

1. Setup environment and CI
2. API foundation (Auth/Users, errors, health)
3. Cars, Events, Media
4. Documents & Reminders
5. Places & Analytics
6. CSV export & MVP release

---

## 📜 License

This project is licensed under the [MIT License](./LICENSE).  
© 2025 Bohdan Strilets
