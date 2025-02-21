# Advanced URL Shortener API 

## Overview

The Advanced URL Shortener API allows users to shorten long URLs, track analytics, and manage URLs efficiently. It supports Google Sign-In authentication, rate-limiting, analytics tracking, and topic-based URL categorization.

### Example Redirection

This URL:  
➡️ **[`https://us.suryathink.com/api/shorten/uQpydU3wQ`](https://us.suryathink.com/api/shorten/uQpydU3wQ)**  
will redirect to:  
🔗 **[`https://github.com/code100x/cms`](https://github.com/code100x/cms)**

## Deployment URL

Production Deployed BaseURL: [https://us.suryathink.com](https://us.suryathink.com)

Health Check Route: [https://us.suryathink.com/health](https://us.suryathink.com/health)

## Features

- Google Sign-In for authentication.
- URL shortening with optional custom alias.
- Rate limiting to prevent abuse.
- URL redirection with analytics tracking.
- Detailed analytics on user engagement, OS type, and device type.
- Topic-based analytics.
- Overall analytics for a user.

## Tech Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB
- **Cache:** Redis
- **Authentication:** Google OAuth
- **Deployment:** AWS EC2, Docker
- **API Documentation:** Swagger

---

## Installation & Setup

### Prerequisites

- Node.js (v18+)
- Docker
- MongoDB instance (local or cloud)
- Redis server (local or cloud)

### Steps to Run Locally

1. **Clone the Repository:**

   ```sh
   git clone https://github.com/suryathink/Advanced-URL-Shortener.git
   cd Advanced-URL-Shortener
   ```

2. **Install Dependencies:**

   ```sh
   npm install
   ```

3. **Set Up Environment Variables:**
   Create a `.env` file in the root directory with the following:

   ```env
   NODE_ENV=development
   PORT=6700
   MONGO_URL=mongodb+srv://<your-db-url>
   REDIS_URL=redis://<your-redis-url>
   JWT_SECRET=<your-jwt-secret>
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   NODE_ENV=development
   ```

4. **Start the Server:**

   ```sh
   npm run start:dev
   ```

   The API will run on `http://localhost:6700`

5. **Access Swagger Docs:**
   Open: `http://localhost:6700/api-docs`

---

## API Endpoints

### 1. User Authentication

#### **Google Sign-In**

- **Endpoint:** `/api/v1/auth/google`
- **Full URL:** `https://us.suryathink.com/api/v1/auth/google`
- **Method:** `POST`
- **Description:** Authenticate users via Google Sign-In.
- **Request Body:**
  ```json
  {
    "idToken": "<google_id_token>"
  }
  ```
- **Response:**
  ```json
  {
    "token": "<jwt_token>",
    "user": {
      "id": "<user_id>",
      "email": "user@example.com"
    }
  }
  ```

---

### 2. Create Short URL

#### **Shorten URL**

- **Endpoint:** `/api/shorten`
- **Full URL:** `https://us.suryathink.com/api/shorten`
- **Method:** `POST`
- **Description:** Generates a short URL from a long URL.
- **Request Body:**
  ```json
  {
    "longUrl": "https://example.com/long-url",
    "customAlias": "optional-alias",
    "topic": "marketing"
  }
  ```
- **Response:**
  ```json
  {
    "shortUrl": "https://us.suryathink.com/uQpydU3wQ",
    "createdAt": "2025-02-19T17:47:53.274Z"
  }
  ```
- **Rate Limiting:** Users can create only a limited number of short URLs per hour.

---

### 3. Redirect Short URL

#### **Redirect to Original URL**

- **Endpoint:** `/api/shorten/{alias}`
- **Full URL:** `https://us.suryathink.com/api/shorten/{alias}`
- **Method:** `GET`
- **Description:** Redirects the user to the original long URL.
- **Response:** 302 Redirect to the original URL.

---

### 4. Get URL Analytics

#### **Retrieve Analytics for a Short URL**

- **Endpoint:** `/api/analytics/{alias}`
- **Full URL:** `https://us.suryathink.com/api/analytics/{alias}`
- **Method:** `GET`
- **Description:** Provides analytics for a short URL.
- **Response:**
  ```json
  {
    "totalClicks": 120,
    "uniqueUsers": 95,
    "clicksByDate": [
      { "date": "2025-02-12", "clicks": 10 },
      { "date": "2025-02-13", "clicks": 15 }
    ],
    "osType": [{ "osName": "Windows", "uniqueClicks": 50, "uniqueUsers": 40 }],
    "deviceType": [
      { "deviceName": "Mobile", "uniqueClicks": 80, "uniqueUsers": 60 }
    ]
  }
  ```

---

### 5. Get Topic-Based Analytics

#### **Retrieve Analytics for a Topic**

- **Endpoint:** `/api/analytics/topic/{topic}`
- **Full URL:** `https://us.suryathink.com/api/analytics/topic/{topic}`
- **Method:** `GET`
- **Description:** Get analytics for all URLs under a topic.
- **Response:**
  ```json
  {
    "totalClicks": 500,
    "uniqueUsers": 350,
    "clicksByDate": [{ "date": "2025-02-12", "clicks": 50 }],
    "urls": [
      {
        "shortUrl": "https://us.suryathink.com/xYZ123",
        "totalClicks": 300,
        "uniqueUsers": 200
      }
    ]
  }
  ```

---

### 6. Get Overall Analytics

#### **Retrieve Overall Analytics**

- **Endpoint:** `/api/analytics/overall`
- **Full URL:** `https://us.suryathink.com/api/analytics/overall`
- **Method:** `GET`
- **Description:** Provides analytics for all user URLs.
- **Response:**
  ```json
  {
    "totalUrls": 50,
    "totalClicks": 10000,
    "uniqueUsers": 5000
  }
  ```

---

### Running on Docker

1. **Build the Docker Image:**
   ```sh
   docker build -t advanced-url-shortener-backend .
   ```
2. **Run the Container:**
   ```sh
   docker run -d -p 6700:6700 --env-file .env advanced-url-shortener-backend
   ```

---

## Challenges & Solutions

### **1. Handling Large Analytics Data**

- Implemented indexing in MongoDB to optimize query performance.
- Used Redis for caching frequently accessed analytics data.

### **2. Preventing Abuse with Rate Limiting**

- Integrated rate limiting using `express-rate-limit` to prevent API misuse.

### **3. Ensuring Secure Authentication**

- Used Google OAuth for secure authentication instead of custom credentials.

---
