<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/14YOO7bv29JfT4MgL0T87hNRKZOp0mkZQ

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. (Optional for prod) Create `.env.local` with:
   ```
   GEMINI_API_KEY=<your Gemini API key>
   VITE_API_BASE_URL=<your deployed backend URL ending with /api>
   ```
3. Run the backend API that ships with this repo:
   ```
   cd backend
   npm install
   npm start
   ```
   The server now starts in mock mode automatically if PostgreSQL env vars are missing, so it can run inside this IDE with no external dependencies.

4. Seed Cloud SQL (optional, only when using the managed database). From Cloud Shell:
   ```
   gcloud sql connect peacock-db --user=postgres
   \i backend/seed.sql
   ```
   The script wipes and repopulates `products`, `reviews`, `users`, and `orders` so `/api/*` endpoints return meaningful demo data (seed user passwords are `peacock123`).
4. Start the frontend in another terminal:
   `npm run dev`

## Troubleshooting

### Connection error on the storefront

- When the app cannot reach the backend API it now falls back to the sample catalog that lives in `constants.ts`. A yellow banner will call this out and any actions that require the backend (profile updates, orders, reviews, product management) will stay disabled.
- To restore full functionality, point `VITE_API_BASE_URL` to a live backend. You can deploy yours by following `backend/README.md` or run it locally with the required environment variables: `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and either `INSTANCE_CONNECTION_NAME`, `DB_SOCKET_PATH`, or `DB_HOST`/`DB_PORT`. The frontend expects the backend to expose its REST API under `/api`. Without those env vars—or when `MOCK_MODE=true`—the backend automatically keeps serving the in-memory mock data. The production build defaults to `https://peacock-backend-service-806651932334.europe-west1.run.app/api`; override it with `VITE_API_BASE_URL` if your backend lives elsewhere.
