
# 🎬 CinemaTube
A backend API for a movie platform, built with **Express 5**, **TypeScript**, **Prisma** and **PostgreSQL**. It includes authentication, email, and Stripe payments, and is deployed on **Vercel**.

![Project diagram](./docs/diagram.png)
<img width="9800" height="3265" alt="diagram" src="https://github.com/user-attachments/assets/2d7ca7bc-a71d-4600-adae-a5c7dd99d82d" />



---

## ✨ Features

- User authentication and sessions (Better Auth, JWT, bcrypt, cookies)
- Movie / content management API `TODO: list real features`
- Payments and webhooks with Stripe
- Email sending with Nodemailer and EJS templates
- Request validation with Zod
- Type-safe database access with Prisma and PostgreSQL
- Serverless deployment on Vercel

## 🧰 Tech Stack

| Area | Tools |
| --- | --- |
| Runtime / Framework | Node.js 20+, Express 5 |
| Language | TypeScript |
| Database / ORM | PostgreSQL, Prisma 7 (`@prisma/adapter-pg`) |
| Auth | Better Auth, jsonwebtoken, bcrypt, cookie-parser |
| Payments | Stripe |
| Email | Nodemailer, EJS |
| Validation | Zod |
| Build / Tooling | tsup, tsx, ESLint, Prettier |
| Hosting | Vercel |

## 📁 Project Structure

```
CinemaTube/
├── api/            # Built output (used by Vercel: api/index.mjs)
├── prisma/         # Prisma schema and migrations
├── src/            # Application source code (entry: src/index.ts)
├── prisma.config.ts
├── tsconfig.json
├── vercel.json
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or newer
- A PostgreSQL database
- A Stripe account (for payments)
- [Stripe CLI](https://stripe.com/docs/stripe-cli) (for testing webhooks locally)

### Installation

```bash
git clone https://github.com/NahiyaNasir/CinemaTube.git
cd CinemaTube
npm install
```

### Environment variables

Create a `.env` file in the project root. `TODO: confirm exact names against your code.`

```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/cinematube"

# Auth
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:5000
JWT_SECRET=your_jwt_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Nodemailer)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

### Set up the database

```bash
npm run generate   # generate Prisma client
npm run migrate    # run migrations (dev)
```

### Run the app

```bash
npm run dev        # development with auto-reload
```

The server runs at `http://localhost:5000`.

### Test Stripe webhooks locally

```bash
npm run stripe:webhook
```

## 📜 Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server with `tsx watch` |
| `npm run build` | Generate Prisma client and bundle to `api/` with tsup |
| `npm start` | Run the built app (`api/index.mjs`) |
| `npm run migrate` | Run Prisma migrations in dev |
| `npm run generate` | Generate the Prisma client |
| `npm run push` | Push the Prisma schema to the database |
| `npm run pull` | Pull the schema from the database |
| `npm run studio` | Open Prisma Studio |
| `npm run lint:fix` | Lint and auto-fix TypeScript files |
| `npm run format` | Format code with Prettier |
| `npm run stripe:webhook` | Forward Stripe webhooks to localhost:5000 |

## 🔌 API Endpoints

`TODO: add your routes, for example:`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/...` | Authentication |
| GET | `/api/movies` | List movies |
| POST | `/webhook` | Stripe webhook |

## ☁️ Deployment

The project is configured for Vercel through `vercel.json`. Run `npm run build`, then deploy. Add all environment variables in your Vercel project settings.

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes and open a pull request

## 📄 License

ISC

## 👤 Author

**Nahiya Nasir** - [@NahiyaNasir](https://github.com/NahiyaNasir)
