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
2. Create `.env.local` with:
   ```
   GEMINI_API_KEY=<your Gemini API key>
   VITE_API_BASE_URL=<your deployed backend URL ending with /api>
   ```
3. Run the app:
   `npm run dev`

## Troubleshooting

### Connection error on the storefront

- When the app cannot reach the backend API it now falls back to the sample catalog that lives in `constants.ts`. A yellow banner will call this out and any actions that require the backend (profile updates, orders, reviews, product management) will stay disabled.
- To restore full functionality, point `VITE_API_BASE_URL` to a live backend. You can deploy yours by following `backend/README.md` or run it locally with the required environment variables: `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and either `INSTANCE_CONNECTION_NAME`, `DB_SOCKET_PATH`, or `DB_HOST`/`DB_PORT`. The frontend expects the backend to expose its REST API under `/api`.
