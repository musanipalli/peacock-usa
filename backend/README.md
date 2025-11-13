# Peacock Backend Deployment Guide

This guide provides the step-by-step commands to deploy the Node.js backend server to Google Cloud Run and provision a managed Cloud SQL for PostgreSQL database.

This architecture ensures your application is scalable, secure, and production-ready.

## Prerequisites

1.  **Google Cloud SDK:** You must have the `gcloud` command-line tool installed and configured. [Installation Guide](https://cloud.google.com/sdk/docs/install)
2.  **Project ID:** Have your Google Cloud Project ID ready.
3.  **Permissions:** Ensure you have `Owner` or `Editor` roles in your GCP project to execute these commands.

---

### Step 1: Set Up Your Environment

Open your Cloud Shell terminal. The project files have been created for you.

1. Find your project directory by running `ls`. It will have a name like `gen-lang-client-XXXXXXXXXX`.
2. `cd` into that directory: `cd gen-lang-client-XXXXXXXXXX`

Now, set your project ID and region. Replace `[YOUR_PROJECT_ID]` and `[YOUR_REGION]` with your actual values (e.g., `us-central1`).

```bash
export PROJECT_ID=[YOUR_PROJECT_ID]
export REGION=[YOUR_REGION]

gcloud config set project $PROJECT_ID
gcloud config set run/region $REGION
```

---

### Step 2: Enable Required Google Cloud APIs

This command enables the necessary services for Cloud Run, Cloud SQL, and building container images.

```bash
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com
```

---

### Step 3: Provision the Cloud SQL PostgreSQL Database

This section creates a secure, managed PostgreSQL database instance.

1.  **Create the Database Instance:**
    This command provisions a new Cloud SQL instance. We'll name it `peacock-db`. Choose a strong password and save it securely.

    ```bash
    export DB_INSTANCE_NAME=peacock-db
    export DB_PASSWORD=[CHOOSE_A_STRONG_PASSWORD]

    gcloud sql instances create $DB_INSTANCE_NAME \
      --database-version=POSTGRES_13 \
      --region=$REGION \
      --root-password=$DB_PASSWORD \
      --tier=db-g1-small
    ```

2.  **Create a Database:**
    Inside your instance, create a specific database for your application. We'll call it `peacock_store`.

    ```bash
    gcloud sql databases create peacock_store --instance=$DB_INSTANCE_NAME
    ```

3.  **Get the Instance Connection Name:**
    This is a unique identifier for your database instance that Cloud Run will use to connect securely. Copy the output of this command; you'll need it in Step 5.

    ```bash
    gcloud sql instances describe $DB_INSTANCE_NAME --format='value(connectionName)'
    ```

---

### Step 4: Build and Push the Backend Container Image

This step packages your Node.js server into a Docker container and uploads it to Google Artifact Registry, a private container repository.

1.  **Create an Artifact Registry Repository:**
    This is a one-time setup to store your container images.

    ```bash
    gcloud artifacts repositories create peacock-backend-repo \
      --repository-format=docker \
      --location=$REGION
    ```

2.  **Build and Push the Image:**
    This command uses Cloud Build to read your `Dockerfile`, build the container image, and push it to the repository you just created. Make sure you are in your project's root directory when you run this.

    ```bash
    gcloud builds submit ./backend \
      --tag $REGION-docker.pkg.dev/$PROJECT_ID/peacock-backend-repo/peacock-server:latest
    ```

---

### Step 5: Deploy the Backend to Cloud Run

This is the final step. We will deploy the container image to Cloud Run and securely connect it to the Cloud SQL database using the instance connection name from Step 3.

Replace `[YOUR_DB_CONNECTION_NAME]` with the value you copied earlier.

```bash
export SERVICE_NAME=peacock-backend-service
export DB_CONNECTION_NAME=[YOUR_DB_CONNECTION_NAME]

gcloud run deploy $SERVICE_NAME \
  --image $REGION-docker.pkg.dev/$PROJECT_ID/peacock-backend-repo/peacock-server:latest \
  --platform managed \
  --allow-unauthenticated \
  --add-cloudsql-instances $DB_CONNECTION_NAME \
  --set-env-vars="DB_USER=postgres" \
  --set-env-vars="DB_PASSWORD=$DB_PASSWORD" \
  --set-env-vars="DB_NAME=peacock_store" \
  --set-env-vars="INSTANCE_CONNECTION_NAME=$DB_CONNECTION_NAME"
```

After the deployment completes, Cloud Run will provide you with a **Service URL**. This is the public URL of your backend API.

---

### Final Step: Update Frontend

In your frontend code (`services/backend.ts`), you will need to replace the placeholder `API_BASE_URL` with the **Service URL** provided by Cloud Run.

```typescript
// in services/backend.ts
// const API_BASE_URL = '/api';
const API_BASE_URL = 'https://peacock-backend-service-....run.app'; // Example URL. Add /api at the end if your server uses it.
```

Your application is now fully deployed with a secure, scalable backend and database!

---

## Local development (optional)

You can point the backend at any reachable PostgreSQL database instead of Cloud SQL sockets by exporting the following before running `npm start`:

```
export DB_USER=<db user>
export DB_PASSWORD=<db password>
export DB_NAME=<db name>
export DB_HOST=<db host, e.g. localhost>
# optionally: DB_PORT (defaults to 5432) or DB_SOCKET_PATH/INSTANCE_CONNECTION_NAME for Unix sockets
```

Once the database is reachable, `npm install && npm start` will boot the Express server locally on port 8080.
