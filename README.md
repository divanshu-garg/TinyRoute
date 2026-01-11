# 🔗 Advanced URL Redirection with QR Codes & Analytics

A **production-oriented URL shortening platform** built using the **MERN stack**, featuring **custom short links, QR code generation, detailed analytics, authentication, and scalable backend architecture**.

This project is designed with **real-world backend engineering practices**, focusing on **performance, observability, and clean architecture**, rather than being a basic CRUD application.


## 🚀 Live Demo

- **Frontend (Vercel):** https://tiny-route.vercel.app/  
<!-- - **Backend API (Railway):** https://your-backend-url.railway.app -->
- **Backend API (render):** https://tinyroute-dx2o.onrender.com/ 

## 🎯 Problem Statement

Most URL shorteners are just basic CRUD applications that focus only on link creation.
In real-world systems, URL redirection is a **high-frequency, latency-sensitive path**
that must handle:

- Millions of reads vs few writes
- Accurate analytics without slowing redirects
- Secure multi-tenant access
- Failure-tolerant third-party integrations (GeoIP, QR storage)

This project was built to explore how a **production-grade URL redirection system**
can be designed with performance, observability, and clean backend architecture in mind.


## ✨ System Capabilities

### 🔗 URL Management
- Create short URLs using:
  - Auto-generated slugs
  - Custom slugs (user-defined)
- Optional link expiration via date or max clicks

### 📊 Advanced Analytics (Per URL & Global)
- Total clicks  
- Unique visitors  
- Clicks today / this week  
- Browser distribution  
- Device type (mobile / desktop / tablet)  
- Country-level geolocation  
- Active vs inactive URLs  
- Aggregated analytics across all user URLs  

### 📎 QR Code Generation
- Generate QR code for each short URL  
- Cloudinary-based QR storage  
- Prevents duplicate QR regeneration  

### 🔐 Authentication & Security
- JWT-based authentication  
- HTTP-only cookies  
- Secure route protection  
- User-specific URL ownership  
- CORS-safe frontend-backend communication  

### ⚙️ Engineering-Grade Backend
- Modular controller–service architecture  
- Centralized error handling  
- Scalable MongoDB schema design  
- Optimized indexing for fast redirects  
- Request metadata extraction (UA, Geo, IP)  

---

## 🧠 Key Engineering Decisions

### 1. Analytics Write Path Is Decoupled from Redirect Latency
Redirects are the hottest path in the system.
Analytics persistence is handled asynchronously to ensure that
redirect latency remains low even under high traffic.

### 2. MongoDB for Analytics over Relational Schema
Click analytics data is append-heavy and schema-flexible
(browser, device, geo may evolve).
MongoDB allows faster iteration without painful migrations.  
Indexes on `short_url` ensure predictable lookup latency
under increasing read traffic.


### 3. QR Codes Stored Externally (Cloudinary)
QR images are binary assets and not part of transactional data.
Storing them externally avoids database bloat and simplifies caching and CDN delivery.

## ⚠️ Failure Scenarios Considered

- GeoIP lookup failures → graceful fallback to `Unknown`
- QR generation failure → rollback Cloudinary uploads
- Duplicate slug creation → indexed uniqueness guarantees
- Expired / inactive URLs → deterministic redirect rejection

## 🛠️ Tech Stack

### Frontend
- React  
- Tailwind CSS  
- TanStack Router  
- TanStack Query  
- Recharts (analytics visualization)  

### Backend
- Node.js (v20)  
- Express.js  
- MongoDB + Mongoose  
- JWT Authentication  
- Cloudinary (QR storage)  

### Analytics & Utilities
- geoip-lite – Country detection  
- ua-parser-js – Browser & device parsing  
- nanoid – URL slug generation  
- qrcode – QR code creation  

---

## 📦 Backend Dependencies

```txt
express, mongoose, jsonwebtoken, nanoid, qrcode,
geoip-lite, ua-parser-js, cloudinary,
cookie-parser, cors, dotenv
```

## 🧱 System Architecture (High Level)
```
Client (React)
     ↓
API Gateway (Express)
     ↓
Auth Middleware (JWT)
     ↓
  Routes
     ↓
Controllers
     ↓
MongoDB (URLs, Users, Analytics)
     ↓
Cloudinary (QR Codes)
```

Designed with horizontal scalability in mind and clean separation of concerns.

## 📈 Analytics Flow (Redirect Request)

1. User visits short URL  
2. Server validates:
   - URL existence  
   - Expiration  
   - Active status  
3. Extract request metadata:
   - IP → Country  
   - User-Agent → Browser & Device  
4. Persist & save analytics asynchronously  
5. Redirect to original URL  

---

## 🧪 Error Handling & Reliability

- Centralized async error handler  
- Custom error classes  
- Graceful fallbacks for:
  - GeoIP failures  
  - QR generation issues  
  - Invalid slugs  
- Cloudinary cleanup on partial failures  


<!-- ## 🖼️ Screenshots

Screenshots are available in the `/screenshots` directory and cover:
- Authentication flow  
- Dashboard analytics  
- Per-URL analytics  
- QR code preview  
- URL creation workflow  

---

## 🚧 Future Improvements

- Rate limiting (Redis-based)  
- Public analytics sharing  
- Webhook support  
- Admin dashboard  
- Click fraud detection  
- Bulk URL upload  
- Export analytics (CSV)   -->

---

## 🧑‍💻 Author

**Divanshu Garg**  
Backend-focused Full Stack Engineer  

Interests:
- Backend architecture & APIs
- Data modeling & analytics systems
- Performance-oriented system design

Tech: MERN | Node.js | MongoDB | REST APIs


### ⭐ Why This Project Stands Out

- Not a tutorial clone
- Production-level backend thinking
- Analytics-heavy system
- Scalable architecture
- Real deployment (Vercel + Railway)

<!-- add. screenshots future scope and high level design diagrams -->