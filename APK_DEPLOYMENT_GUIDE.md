# 📱 Complete Guide: Android APK Generation with Connected Backend

This guide details the step-by-step process to build a production-ready Android APK for a full-stack application (Frontend + Backend).

---

## 🏗️ Phase 1: Backend Deployment (First)
**Rule #1**: Your Android app needs a live server to talk to. Localhost (`http://localhost:5000`) **will not work** on a physical phone.

1.  **Prepare Server Code**:
    *   Ensure strict imports are handled (use relative paths `../shared/` instead of aliases `@shared/` if building bundles).
    *   Enable **CORS** in your server entry point (`index.ts`):
        ```typescript
        import cors from "cors";
        app.use(cors()); // Allow all origins for mobile access
        ```
    *   Verify `PORT` binding (host `0.0.0.0`, port from `process.env.PORT`).

2.  **Deploy**:
    *   Push code to GitHub.
    *   Deploy to a cloud provider (Google Cloud Run, DigitalOcean App Platform, Render, or Heroku).
    *   **Result**: Get your PUBLIC URL (e.g., `https://my-app.run.app`).

3.  **Verify**:
    *   Run `curl https://your-app.run.app/api/health` to confirm the server is live and accessible.

---

## 🔌 Phase 2: Frontend Configuration
Now, connect your frontend to the live backend.

1.  **Configure API Client (`client/src/lib/api.ts`)**:
    *   Your app cannot use relative paths like `/api/todos` inside the APK (since it hosts files locally).
    *   Add logic to prefix requests with the Cloud URL when running in Production:
        ```typescript
        let path = "/api/todos";
        if (import.meta.env.PROD && path.startsWith("/")) {
             path = "https://your-live-backend-url.run.app" + path;
        }
        ```

2.  **Update `capacitor.config.ts`**:
    *   Ensure `webDir` matches your build output (usually `dist` or `dist/public`).
    *   (Optional but Recommended) Enable Native HTTP to avoid CORS issues on some devices:
        ```typescript
        plugins: {
          CapacitorHttp: {
            enabled: true
          }
        }
        ```

---

## 🤖 Phase 3: Android Project Setup

1.  **Initialize Capacitor (if new)**:
    ```bash
    npm install @capacitor/core @capacitor/cli @capacitor/android
    npx cap init
    npx cap add android
    ```

2.  **Update Manifest (`android/app/src/main/AndroidManifest.xml`)**:
    *   Add internet permissions (usually added by default).
    *   Add `android:usesCleartextTraffic="true"` to the `<application>` tag if you need to debug or use non-HTTPS endpoints (optional for Prod, good for Dev).

---

## 📦 Phase 4: The Build Process
This is the cycle you run every time you change your code.

1.  **Build Web Assets**:
    Compile your React/Vue/Frontend code into static files.
    ```bash
    npm run build
    ```

2.  **Sync to Android**:
    Copy the `dist` folder into the Android native project.
    ```bash
    npx cap sync android
    ```

3.  **Open Android Studio**:
    ```bash
    npx cap open android
    ```

---

## 🛠️ Phase 5: Generating the APK (In Android Studio)

1.  **Gradle Sync**: Allows Android Studio to download dependencies. Wait for the loading bars at the bottom right to finish.
2.  **Clean Project** (Good practice):
    *   Go to **Build** > **Clean Project**.
3.  **Build APK**:
    *   Go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
    *   _Note: "Build Bundle (AAB)" is for Play Store publishing. "Build APK" is for direct install._
4.  **Locate & Install**:
    *   A notification will appear: "APK(s) generated successfully".
    *   Click **locate**.
    *   Transform `app-debug.apk` to your phone via USB or Google Drive.
    *   Install and Test!

---

## 🚨 Troubleshooting Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| **"Failed to Fetch"** | Frontend is trying to hit `localhost` or CORS is blocked. | Use absolute Cloud URL (`https://...`) and enable CORS on server. |
| **"Service Unavailable (503)"** | Server crashed or deployment failed. | Check server logs. Ensure imports are correct (relative paths). |
| **"Cleartext Traffic not permitted"** | Using `http://` instead of `https://`. | Use HTTPS or enable `usesCleartextTraffic`. |
