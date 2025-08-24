# 🚗 Garage

## 🏷 Badges

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js&logoColor=white)  
![NestJS](https://img.shields.io/badge/NestJS-9-red?logo=nestjs&logoColor=white)  
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green?logo=mongodb&logoColor=white)  
![React](https://img.shields.io/badge/React-18-blue?logo=react&logoColor=white)  
![Zustand](https://img.shields.io/badge/Zustand-state--manager-orange)  
![React Query](https://img.shields.io/badge/React%20Query-async--state-ff4154?logo=reactquery&logoColor=white)  
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)  
![Prettier](https://img.shields.io/badge/Code_Style-Prettier-ff69b4?logo=prettier&logoColor=white)  
![ESLint](https://img.shields.io/badge/Lint-ESLint-purple?logo=eslint&logoColor=white)

---

A web application for vehicle analytics: tracking fuel and maintenance expenses, storing valid car documents, managing multiple cars per user, photo gallery, and — in the future — a blog.

## 📌 Features

- User registration and authentication
- Manage multiple cars
- Add information about refueling, repairs, and maintenance
- Attach receipts and documents to expenses
- Keep contacts (mechanics, services, shops) with phone numbers, links, and map locations
- Interactive map with service addresses and personal markers
- Track mileage with a "road map" (dates, tasks, refuels, routes)
- Statistics, analytics, and report generation

## 🛠 Tech Stack

**Backend:**

- [NestJS](https://nestjs.com/)
- MongoDB
- TypeScript
- JWT (authentication)
- CRUD API

**Frontend:**

- [React](https://react.dev/)
- Zustand
- React Query
- React Hook Form
- Animations (Framer Motion / other libraries)

## 🚀 Installation & Run

### Backend

```bash
# install dependencies
npm install

# run in dev mode
npm run dev

# production build
npm run build
npm start

# linting & formatting
npm run lint
npm run format

# type checking
npm run type-check
```

## 📂 Project Structure

- `/api` — backend (NestJS + MongoDB)
- `/frontend` — frontend (React + Zustand + React Query) _(separate repository)_

## 🗺 Roadmap

- [ ] Photo gallery for cars
- [ ] Personal blog / notes
- [ ] Extended analytics
- [ ] Push notifications for services and documents
- [ ] Export reports (PDF, Excel)

## 👨‍💻 Author

**Bohdan Strilets**
