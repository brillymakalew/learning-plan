# Deployment Guide (VPS with Docker)

## Pre-requisites
1.  **VPS**: A server (e.g., DigitalOcean, AWS EC2) with Docker and Docker Compose installed.
2.  **Git**: Installed on both local machine and VPS.
3.  **Neon DB**: Your existing database URL.

## Steps

### 1. Push to Git
On your local machine:
```bash
git add .
git commit -m "Configure Docker for Neon DB"
git push origin main
```

### 2. Clone/Pull on VPS
SSH into your VPS:
```bash
ssh user@your-vps-ip
cd learning-roadmap
git pull
```

### 3. Setup Environment
Create or edit `.env` file on the VPS:
```bash
nano .env
```
Paste your **Neon Database URL** and other secrets:
```
DATABASE_URL=postgres://user:password@ep-xyz.aws.neon.tech/learning_roadmap?sslmode=require
OWNER_EDIT_KEY=your_secret_key
# Any other vars from your local .env
```

### 4. Run Docker Compose
```bash
docker compose up --build -d
```
This will:
- Build the Next.js app image.
- Start the App on port **3010**.
- Connect to your **Neon Database** (defined in `.env`).

### 5. Verify
Visit `http://<your-vps-ip>:3010`.

## Notes
-   If you see database errors, check that your VPS IP is allowed in Neon (if you have IP restrictions).
-   `public/uploads` are stored on the VPS disk.
