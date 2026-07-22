# 💊 Pharmaciano — Frontend

<!-- <img width="1200" height="720" alt="Pharmaciano ERP Banner" src="https://github.com/user-attachments/assets/eda99e11-e44c-4da4-8683-55e9a52267bd" /> -->

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.0.0-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Shadcn_UI-0.0.4-000000?style=flat-square" alt="Shadcn UI" />
  <img src="https://img.shields.io/badge/Status-Active-success?style=flat-square" alt="Status" />
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-live-preview">Live Preview</a> •
  <a href="#-key-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-team">Team</a>
</p>

---

## 📖 Overview

**Pharmaciano** is a **cross-platform, multi-vendor Pharmacy ERP system** built to help pharmacies in Bangladesh move away from manual, paper-based operations into a modern, automated, and data-driven workflow.

This repository contains the **frontend web application** — the interface used by super admins, branch managers, and sales staff to manage inventory, process sales, generate invoices, and view AI-powered demand forecasts across multiple branches and warehouses.

The frontend is built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **Shadcn UI**, focused on speed, responsiveness, and a clean user experience across desktop, tablet, and mobile devices.

> This project was developed as part of our **B.Sc. in CSE Final Year Design Project (FYDP)**, built by a team of three engineers, each responsible for a core part of the system (frontend, backend, and mobile app).

---

## 🌐 Live Preview

🔗 **Live Demo 1 (Recommended): [https://pharmaciano.vercel.app](https://pharmaciano.vercel.app/)**  
🔗 **Live Demo 2 (Alternative): [https://pharmaciano.netlify.app](https://pharmaciano.netlify.app/)**

> Both links provide the same application. The alternative deployment is available in case there are occasional accessibility issues with the Vercel deployment.

## 🎨 Design Prototype

The complete UI/UX design and prototype is available on Figma:
🔗 **[View Figma Design](https://www.figma.com/proto/xPg6xwGod0Lp2JG2OCwnGH/Pharmaciano?node-id=17-69&t=EaWedtJl0tvUu4PS-0&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=3%3A1077)**

---

## ⚡ Key Features

| Feature | Description |
|---|---|
| 🏢 **Multi-Branch Management** | Manage multiple pharmacy branches and warehouses from a single, centralized dashboard. |
| 🔐 **Role-Based Access Control** | Fully customizable roles (Super Admin, Manager, Cashier, Salesman, etc.) with granular permissions. |
| 📦 **Inventory & Stock Management** | Track stock, batches, and expiry across branches in real time. |
| 🧾 **Automated Billing & Invoicing** | Point-of-sale (POS) system with automatic invoice generation. |
| 🤝 **Supplier & Purchase Management** | Manage suppliers, purchase orders, and vendor relationships. |
| 💰 **Accounts & Ledger** | Track debit/credit entries and manage business finances. |
| 🤖 **AI-Based Demand Forecasting** | AI-powered predictions for trending and future medicine demand, helping reduce overstock and expiry loss. |
| 📊 **Analytics Dashboard** | Visualize sales, stock, and performance trends with interactive charts and graphs. |
| 📱 **Fully Responsive UI** | Optimized experience across desktop, tablet, and mobile devices. |

---

## 🛠️ Tech Stack

### Core Framework
| Package | Version |
|---|---|
| Next.js | 16.0.0 |
| React | 19.2.0 |
| React DOM | 19.2.0 |
| TypeScript | ^5 |

### UI & Styling
| Package | Version |
|---|---|
| Shadcn UI | 0.0.4 |
| Tailwind CSS | ^4 |
| tailwind-merge | 3.3.1 |
| class-variance-authority | 0.7.1 |
| tw-animate-css | 1.4.0 |
| next-themes | 0.4.6 |
| clsx | 2.1.1 |
| Lucide React Icons | 0.548.0 |
| React Transition Group | 4.4.5 |

### State Management & API
| Package | Purpose |
|---|---|
| Zustand | Global state management |
| Axios | HTTP client for REST API communication |

### Build & Development Tools
| Package | Version |
|---|---|
| ESLint | ^9 |
| eslint-config-next | 16.0.0 |
| @tailwindcss/postcss | ^4 |
| Babel React Compiler Plugin | 1.0.0 |
| baseline-browser-mapping | 2.9.0 |

---

## 🏗️ System Architecture

Pharmaciano follows an **API-first architecture** — the frontend communicates with the backend exclusively through secured RESTful APIs, authenticated using JWT.

```
Next.js Frontend  ⇄  RESTful API  ⇄  Express.js Backend  ⇄  MongoDB
                                            ⇅
                                   Redis (Caching) + AI Model (Gemini API)
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed:
- **Node.js** (v18 or later recommended)
- **npm** / **yarn** / **pnpm**
- A running instance of the [Pharmaciano Backend](https://github.com/sohelrana2002/Pharmaciano)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ShowravKormokar/Pharmaciano.git

# 2. Navigate into the project directory
cd Pharmaciano

# 3. Install dependencies
npm install

# 4. Create an environment file
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root directory and configure the following:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Pharmaciano
```

> ⚠️ Update the values above to match your local or deployed backend configuration.

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### Build for Production

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
frontend/
|   src/
|   ├── app/                # Next.js app router pages and layouts
|   │   ├── (auth)/
|   │   ├── dashboard/
|   │   │   ├── sales/
|   │   │   ├── inventory/
|   │   │   ├── purchase/
|   │   │   ├── contacts/
|   │   │   ├── warehouse/
|   │   │   ├── accounting/
|   │   │   ├── analytics/
|   │   │   ├── reports/
|   │   │   ├── admin/
|   │   │   └── settings/
│   │   ├── page.tsx
|   │   └── layout.tsx
|   ├── hooks/
|   ├── constants/
|   ├── providers/
|   ├── utils/               # Utility functions
|   ├── services/
|   ├── components/          # Reusable UI components (Shadcn-based)
|   ├── lib/                 # API clients (Axios)
|   ├── stores/              # Zustand global state stores
|   ├── types/               # TypeScript type definitions
|   ├── styles/              # Global Tailwind CSS styles
|   └── .env.example         # Sample environment variables
├── public/                  # Static assets (images, icons)
└── README.md
```

> Folder names may vary slightly depending on the current codebase version.

---

## 📸 Screenshots

> _Screenshots below showcase the analytics dashboard, inventory management screen, and POS/billing interface of Pharmaciano._

<!-- Add dashboard screenshot here -->
<img width="1200" height="720" alt="Pharmaciano Dashboard Screenshot" src="" />

<!-- Add inventory management screenshot here -->
<img width="1200" height="720" alt="Pharmaciano Inventory Management Screenshot" src="" />

<!-- Add POS / billing screenshot here -->
<img width="1200" height="720" alt="Pharmaciano POS and Billing Screenshot" src="" />

---

## 🗺️ Roadmap

- [ ] Full Bangla language support
- [ ] Offline/low-bandwidth mode for rural pharmacies
- [ ] Advanced analytics and export options
- [ ] Push notifications for low stock and expiry alerts

---

## 🤝 Contributing

This is a university final year project and is not currently open for external contributions. However, feel free to fork the repository for learning or reference purposes.

---

## 📄 License

This project is developed for academic purposes as part of a Final Year Design Project (FYDP). Contact the team for reuse or licensing inquiries.

---

## 👥 Team

Built with ❤️ by a team of three:

| Role | Member | GitHub |
|---|---|---|
| 🎨 Frontend Development | **Showrav Kormokar** | [@ShowravKormokar](https://github.com/ShowravKormokar/Pharmaciano) |
| ⚙️ Backend Development | **Md. Sohel Rana** | [@sohelrana2002](https://github.com/sohelrana2002/Pharmaciano) |
| 📱 Mobile App Development | **Md. Rafiz Uddin** | [@rafiz001](https://github.com/rafiz001/pharmaciano-flutter) |

---

<p align="center">Made with dedication for pharmacies across Bangladesh 🇧🇩</p>