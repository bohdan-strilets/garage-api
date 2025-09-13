# Garage API

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/>
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white"/>
  <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black"/>
</p>

**Garage API** — a service for tracking car expenses and maintenance with analytics and reminders.  
It allows storing data about fuel, repairs, insurance, documents, and generating expense reports.

---

## ✨ Features

- 🔑 User registration and authentication (JWT + Refresh tokens)
- 🚗 Vehicle management: specifications, mileage, documents
- ⛽ Expense tracking for fuel, service, insurance, and other costs
- 📊 Analytics: total expenses, reports, reminders
- 🖼️ Document storage and car galleries (planned)

---

## 🛠️ Tech Stack

- **Backend:** [NestJS](https://nestjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Authentication:** JWT (Access + Refresh tokens, Cookies, sessions)
- **Infrastructure:** Husky, ESLint, Prettier, Lint-Staged, Commit Hooks
- **Testing:** Jest (planned)

---

## 📂 Project Structure

```
src/
  common/        # shared filters, interceptors, utils
  modules/
    auth/        # authentication, tokens
    user/        # user management
    vehicle/     # vehicle data (planned)
    expense/     # expense tracking (planned)
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run in dev mode
npm run dev

# Build and run in prod
npm run build
npm run start
```

### Environment Variables (`.env`)

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/garage
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ISSUER=garage-api
JWT_AUDIENCE=garage-client
```

---

## ✅ TODO / Roadmap

- [x] Base NestJS project
- [ ] User registration and authentication
- [ ] Sessions and refresh tokens
- [ ] Vehicle management
- [ ] Expense and fuel tracking
- [ ] Reminders and notifications
- [ ] Gallery and document storage
- [ ] Testing (unit + e2e)
- [ ] CI/CD pipeline

---

## 📜 License

This project is licensed under the **MIT License**.  
Feel free to use and modify it for your own purposes.
