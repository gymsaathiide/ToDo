# 📝 ToDo App

> A robust, full-stack Task Management application built with **React**, **Express**, and **Supabase**, engineered for seamless Android deployment via **Capacitor**.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=flat&logo=supabase&logoColor=3ECF8E)
![Android](https://img.shields.io/badge/Android-3DDC84?style=flat&logo=android&logoColor=white)

---

## ✨ Features

*   **🔒 Secure Authentication**: Robust sign-up and sign-in flows powered by Supabase Auth (JWT).
*   **✅ Task Management**: effortlessly Create, Read, Update, and Delete your daily tasks.
*   **🔄 Real-time Sync**: Your data is legally synchronized with a managed PostgreSQL database.
*   **📱 Native Android Support**: Packaged as a standalone APK using Capacitor for near-native performance.
*   **🛡️ Secure API**: Custom Express backend with middleware middleware for authenticated requests.

## 🛠️ Technology Stack

| Frontend | Backend | Database & Auth | Mobile |
| :--- | :--- | :--- | :--- |
| ![React](https://img.shields.io/badge/-React-black?logo=react) **React** | ![Node](https://img.shields.io/badge/-Node.js-green?logo=node.js) **Node.js** | ![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?logo=supabase) **Supabase** | ![Capacitor](https://img.shields.io/badge/-Capacitor-1199EE?logo=capacitor) **Capacitor** |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-blue?logo=typescript) **TypeScript** | ![Express](https://img.shields.io/badge/-Express-black?logo=express) **Express** | ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql) **PostgreSQL** | ![Android](https://img.shields.io/badge/-Android-3DDC84?logo=android) **Android** |
| ![Tailwind](https://img.shields.io/badge/-Tailwind-38B2AC?logo=tailwindcss) **Tailwind CSS** | | | |

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

*   Node.js (v18+)
*   npm
*   Android Studio (for mobile build)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Rahulsh97297/ToDo.git
    cd ToDo
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_URL=your_supabase_url
    SUPABASE_ANON_KEY=your_supabase_anon_key
    SESSION_SECRET=your_complex_session_secret
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 📱 Building for Android (APK)

1.  **Build Web Assets**
    ```bash
    npm run build
    ```

2.  **Sync with Capacitor**
    ```bash
    npx cap sync
    ```

3.  **Open in Android Studio**
    ```bash
    npx cap open android
    ```
    *Inside Android Studio:* Go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.

## 📂 Project Structure

```bash
/
├── client/             # 🎨 React Frontend
│   ├── src/
│   │   ├── components/ # UI Components (ShadCN)
│   │   ├── pages/      # Route Pages
│   │   └── lib/        # API & Utils
├── server/             # ⚙️ Express Backend
│   ├── routes.ts       # API Endpoints
│   └── middleware.ts   # Auth Middleware
├── android/            # 🤖 Native Android Project
└── shared/             # 📦 Shared Types & Schema
```

---

Made with ❤️ by Rahul
