# AI Chat Application

This is a full-stack AI Chat application built with React, Vite, Node.js, Express, and MongoDB. It allows users to chat with an AI (powered by Groq Llama 3 Vision) and upload images as context.

## Prerequisites
- **Node.js**: `v18` or higher
- **Package Manager**: `pnpm` or `yarn` installed globally
- **Docker**: For running the MongoDB database locally

## 🚀 Getting Started

### 1. Database Setup
The backend requires a MongoDB database. You can start a local instance instantly using the provided `docker-compose.yml` file.
```bash
docker-compose up -d
```
*Note: This will spin up a MongoDB instance on port 27017 with user `root` and password `examples`.*

### 2. Backend Setup
1. Open a terminal and navigate to the `server` directory:
```bash
cd server
```
2. Install dependencies:
```bash
pnpm i
```
3. Environment Variables:
Copy `.env.example` to `.env` (or create a `.env` file) and fill in your keys:
```env
PORT = "8080"
NODE_ENV = "development"
LOG_LEVEL = "info"
API_HOST = "localhost"

# JWT Configuration
JWT_ACCESS_SECRET = "your-access-secret"
JWT_REFRESH_SECRET = "your-refresh-secret"

# Cloudinary Configuration (For image uploads)
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Mongo Configuration
MONGO_URL = 'mongodb://root:examples@localhost:27017'

# AI Configuration (Groq API Key)
AI_API_KEY = "gsk_..."
```
4. Start the development server:
```bash
pnpm run dev
```
*The server will run at `http://localhost:8080`.*

### 3. Frontend Setup
1. Open a new terminal and navigate to the `client` directory:
```bash
cd client
```
2. Install dependencies:
```bash
pnpm i
```
3. Start the Vite development server:
```bash
pnpm run dev
```
*The app will run at `http://localhost:3000` (or `5173` depending on Vite configuration).*

## 🌟 Usage
Open the frontend URL in your browser. 
Register for a new account or log in. 
Click the `+` icon to upload images, type your prompt, and interact with the AI assistant!
