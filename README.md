# Advanced URL Shortener API

## 📌 Overview
The **Advanced URL Shortener API** is a high-performance, scalable URL shortening service built with **Node.js, Express, TypeScript, and MongoDB**. It includes features like user authentication, analytics tracking, rate limiting, Redis caching, and Dockerization.

## 🚀 Features
- **URL Shortening**: Generate short URLs that redirect to long URLs.
- **Google OAuth Authentication**: Users can log in via Google.
- **Rate Limiting**: Prevents API abuse using `express-rate-limit`.
- **Redis Caching**: Improves performance for frequently accessed URLs.
- **Analytics Tracking**: Track the number of times a URL is accessed.
- **Swagger API Docs**: Auto-generated documentation.
- **Dockerized Deployment**: Easy containerized setup.
- **Production Deployment**: Hosted on AWS EC2.

---

## 📂 Project Structure
```
/Advanced-URL-Shortener
├── /client               # Frontend (if applicable)
├── /server               # Backend API
│   ├── /routes           # API Routes
│   ├── /controllers      # Controllers handling logic
│   ├── /models           # MongoDB models
│   ├── /middlewares      # Middleware functions
│   ├── /config           # Configuration files (env, DB, Redis)
│   ├── /utils            # Helper functions
│   ├── server.ts         # Main server file
│   ├── swagger.ts        # Swagger Documentation setup
│   ├── docker-compose.yml
├── .env                  # Environment variables
├── package.json          # Dependencies and scripts
├── README.md             # Documentation
```

---

## 🛠️ Installation & Running Locally
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/suryathink/Advanced-URL-Shortener.git
cd Advanced-URL-Shortener/server
```
### **2️⃣ Install Dependencies**
```sh
npm install
```
### **3️⃣ Set Up Environment Variables**
Create a `.env` file in the root of the `server` directory:
```
PORT=6700
MONGO_URL=mongodb+srv://your_mongo_uri
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://your_redis_url
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### **4️⃣ Start the Server**
```sh
npm run dev  # For development
npm run build && npm start  # For production
```
### **5️⃣ Access the API**
- **Base URL (Local)**: `http://localhost:6700`
- **Base URL (Production)**: `https://us.suryathink.com`
- **Swagger Docs**: `https://us.suryathink.com/api-docs`

---

## 📜 API Endpoints
### **1️⃣ Authentication**
#### **Google OAuth**
- `POST /api/v1/auth/google`
  - Request: `{ token: "google_access_token" }`
  - Response:
    ```json
    {
      "success": true,
      "token": "jwt_token",
      "user": {
        "id": "user_id",
        "email": "user@example.com"
      }
    }
    ```

### **2️⃣ URL Shortening**
#### **Shorten a URL**
- `POST /api/shorten`
  - Request:
    ```json
    {
      "longUrl": "https://example.com"
    }
    ```
  - Response:
    ```json
    {
      "shortUrl": "https://us.suryathink.com/api/shorten/uQpydU3wQ"
    }
    ```

#### **Redirect to Original URL**
- `GET /api/shorten/{alias}`
  - Example: `GET /api/shorten/uQpydU3wQ`
  - Response: Redirects to original URL

### **3️⃣ Analytics**
#### **Get URL Analytics**
- `GET /api/analytics/{alias}`
  - Response:
    ```json
    {
      "alias": "uQpydU3wQ",
      "clicks": 150,
      "createdAt": "2025-02-19T17:47:51.497Z"
    }
    ```

---

## 🚢 Deployment
### **1️⃣ Docker Setup**
#### **Build and Run the Container**
```sh
docker build -t advanced-url-shortener .
docker run -p 6700:6700 --env-file .env advanced-url-shortener
```
#### **Using Docker Compose**
```sh
docker-compose up --build -d
```
#### **Restart Docker Container**
```sh
docker restart url-shortener-backend
```

### **2️⃣ AWS EC2 Deployment (Production)**
- **SSH into EC2 Instance**
  ```sh
  ssh -i your-key.pem ubuntu@your-ec2-ip
  ```
- **Pull the Latest Code & Restart Docker**
  ```sh
  git pull origin main
  docker-compose up --build -d
  ```


---

## 🌍 Live Demo
✅ **Live URL:** [https://us.suryathink.com](https://us.suryathink.com)
✅ **API Docs:** [https://us.suryathink.com/api-docs](https://us.suryathink.com/api-docs)

