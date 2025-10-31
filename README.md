# 🚗 Garage API

**Garage API** is a backend service built with **NestJS + TypeScript**, designed to manage vehicle history, including refuels, repairs, and car documents.  
It will serve as the backend for the upcoming **Garage client app** (React).

> 🧩 Educational / portfolio project — focused on building clean, scalable backend architecture with modern tooling.

---

## 🧠 Project Overview

This API allows you to:

- 🔑 Register and authenticate users (JWT + cookies)
- 🚘 Manage personal vehicles and their info
- 🛠️ Track car repairs, refuels, and related costs
- 📄 Store and organize car documents (insurance, technical, etc.)
- ☁️ Persist data on **MongoDB Atlas**
- 🇬🇧 🇵🇱 🇺🇦 Support for multiple languages (planned, mostly on client side)

---

## ⚙️ Tech Stack

| Category               | Technologies                                             |
| ---------------------- | -------------------------------------------------------- |
| **Backend Framework**  | [NestJS](https://nestjs.com/) (TypeScript)               |
| **Database**           | [MongoDB Atlas](https://www.mongodb.com/atlas)           |
| **Validation & DTOs**  | `class-validator`, `class-transformer` _(planned)_       |
| **Auth**               | JWT + Cookies + Sessions                                 |
| **Dev Tools**          | ESLint, Prettier, Husky, Commitlint, lint-staged         |
| **Tests**              | Jest (unit & e2e)                                        |
| **Version Management** | [Volta](https://volta.sh/) (Node 20.10.0 + Yarn 1.22.22) |

---

## 🛠️ Development Setup

### 1️⃣ Clone and install

```bash
git clone https://github.com/bohdan-strilets/garage-api.git
cd garage-api
yarn install
```

### 2️⃣ Setup environment

Create a `.env` file:

```bash
MONGODB_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<your-jwt-secret>
PORT=3000
```

### 3️⃣ Run in dev mode

```bash
yarn start:dev
```

Server will start at: **http://localhost:3000**

---

## 🧹 Tooling & Code Quality

The project enforces clean code and consistency through:

| Tool                       | Purpose                                |
| -------------------------- | -------------------------------------- |
| **ESLint + Prettier**      | Code linting and formatting            |
| **simple-import-sort**     | Auto-sorting of imports                |
| **Husky**                  | Git hooks (pre-commit, pre-push)       |
| **Commitlint**             | Conventional commit messages           |
| **lint-staged**            | Runs lint/format only on changed files |
| **Volta**                  | Node/Yarn version management           |
| **TypeScript strict mode** | Safer type checking                    |
| **.editorconfig**          | Consistent editor formatting           |

### 🪝 Husky Hooks

- **pre-commit:** Lint & format staged files
- **pre-push:** Type check & run tests
- **commit-msg:** Validate Conventional Commit style
- **post-merge / post-checkout:** Auto-install dependencies if lockfile changed
- **\_verify-versions:** Ensures Node/Yarn match Volta config

---

## 🧪 Testing

```bash
yarn test        # run all tests
yarn test:watch  # watch mode
```

> ✅ Jest is configured with `--passWithNoTests`, so early pushes won’t fail until tests are added.

---

## 📂 Project Structure

```
/src
 ├── modules
 │   ├── auth
 │   ├── user
 │   ├── car
 │   ├── refuel
 │   ├── repair
 │   └── documents
 ├── common
 │   ├── filters
 │   ├── interceptors
 │   ├── guards
 │   └── utils
 ├── main.ts
 └── app.module.ts
```

---

## 💬 Commit Convention

Follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>
```

Examples:

```
feat(auth): add refresh token rotation
fix(refuel): correct liters rounding
chore(config): setup ESLint and Husky
```

---

## 🧰 Useful Commands

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `yarn start:dev`  | Run NestJS in watch mode     |
| `yarn build`      | Build the app                |
| `yarn lint`       | Run ESLint                   |
| `yarn lint:fix`   | Fix lint issues              |
| `yarn format:fix` | Format code with Prettier    |
| `yarn typecheck`  | Run TypeScript type checking |
| `yarn test`       | Run Jest tests               |

---

## 🧩 Future Plans

- Add full CRUD for all modules (cars, refuels, repairs, documents)
- Role-based permissions
- Multi-language API responses (EN, PL, UA)
- File uploads for documents (via Cloudinary)
- Swagger API documentation
- Docker support for easy deployment
- Connect to Garage Client (React app)

---

## 👨‍💻 Author

**Bohdan Strilets**  
Full-stack developer (NestJS / React / TypeScript)  
📫 [GitHub](https://github.com/bohdan-strilets)

---

## 🧾 License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**.

You may view, learn from, and reuse parts of the code for personal or educational purposes,  
but **commercial use or redistribution is prohibited**.

For full details, see [LICENSE.md](./LICENSE.md).

---

### 🧠 Note

> This backend is part of a bigger educational project.  
> Goal: learn and apply clean architecture, modern tooling, and full project lifecycle — from setup to deployment.

---

## 🏷️ Badges

![Node](https://img.shields.io/badge/Node-20.10.0-43853d?logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-v10-E0234E?logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Yarn](https://img.shields.io/badge/Yarn-1.22.22-2188B6?logo=yarn)
![ESLint](https://img.shields.io/badge/Code%20Style-ESLint%20+%20Prettier-purple)
![Husky](https://img.shields.io/badge/Git%20Hooks-Husky-blue)
![Volta](https://img.shields.io/badge/Runtime-Volta-ff6f00)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-4DB33D?logo=mongodb)
![Jest](https://img.shields.io/badge/Tests-Jest-99424f?logo=jest)

---

© 2025 **Bohdan Strilets** — Licensed under  
[Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/).
