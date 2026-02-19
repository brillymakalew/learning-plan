# Deployment Guide (VPS with Docker)

## Pre-requisites
1.  **VPS**: A server (e.g., DigitalOcean, AWS EC2) with Docker and Docker Compose installed.
2.  **Git**: Installed on both local machine and VPS.
3.  **GitHub/GitLab Repo**: This project pushed to a repository.

## Steps

### 1. Push to Git
On your local machine:
```bash
git add .
git commit -m "Dockerize app"
git push origin main
```

### 2. Clone on VPS
SSH into your VPS:
```bash
ssh user@your-vps-ip
```

Clone the repo:
```bash
git clone https://github.com/your-username/learning-roadmap.git
cd learning-roadmap
```

### 3. Setup Environment
Create a `.env` file on the VPS (since it's gitignored):
```bash
nano .env
```
Paste your environment variables:
```
DATABASE_URL=postgresql://postgres:postgres@db:5432/learning_roadmap?schema=public
# Add owner key if used
OWNER_EDIT_KEY=your_secret_key
```
*(Note: The `DATABASE_URL` matches the one in `docker-compose.yml` internal network)*

### 4. Run Docker Compose
```bash
docker compose up --build -d
```
This will:
- Build the Next.js app image.
- Start the Postgres database.
- Start the App on port **3010** (mapped to container 3000).

### 5. Verify
Visit `http://<your-vps-ip>:3010`.

## Updates
When you make changes locally:
1.  `git push`
2.  On VPS: `git pull`
3.  `docker compose up --build -d` (Re-builds and restarts updated containers)
