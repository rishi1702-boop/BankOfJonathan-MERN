# BankOfJonathan 🏦

**BankOfJonathan** is a deep, sophisticated MERN stack banking application engineered with enterprise-level architecture, robust security, and a beautiful, modern user interface. It is designed to demonstrate advanced web development practices and serves as a comprehensive portfolio project showcasing end-to-end full-stack capabilities.

## 🚀 Key Features

### 🛡️ Enterprise-Grade Security
* **Advanced Authentication:** Secure JWT implementation utilizing **HTTP-Only Cookies** to mitigate XSS (Cross-Site Scripting) vulnerabilities.
* **Role-Based Access Control (RBAC):** Distinct `user` and `admin` roles, secured by robust middleware layers guarding sensitive endpoints.
* **Brute-Force Protection:** API rate limiting implemented via `express-rate-limit` prevents malicious bulk login attempts.
* **Strict Request Validation:** Complete end-to-end data integrity pipeline using **Zod** on the backend and **React Hook Form + Zod** on the frontend, catching malformed data before it reaches the controllers.
* **Security Headers:** HTTP headers hardened with **Helmet**.

### 💼 Advanced Financial Operations
* **P2P Money Transfers & Requests:** Users can instantly send funds via secure PIN validation, or request funds. Incoming requests can be seamlessly approved or declined from a dedicated dashboard widget.
* **Dynamic Cash Flow Analytics:** The dashboard features dynamically generated interactive charts (via Recharts) mathematically deriving a 14-day spending trend directly from a user's chronological transaction history.
* **CSV Statement Generation:** One-click utility natively parses and compiles transaction histories into an instantly downloadable `.csv` statement.
* **AI Financial Assistant:** Integrated AI chatbot capable of analyzing and interpreting user banking queries natively within the dashboard context.

### 🎨 Premium UI/UX & State Management
* **State Management:** Complete frontend decoupled from generic state via **Zustand** (for global complex UI state) and **TanStack React Query** (for highly optimized, cached server-state fetching, minimizing API calls).
* **Modern Interface:** Hand-crafted UI leveraging **Tailwind CSS (v4)**, featuring frosted glassmorphism elements, intuitive dashboards, and responsive design across all viewports.
* **Micro-Animations:** Fluid, buttery-smooth page transitions and component mounting using **Framer Motion**.

---

## 🛠️ Technology Stack

### Frontend
* **Core:** React 18, Vite
* **State Management:** Zustand, TanStack React Query (`@tanstack/react-query`)
* **Styling & Animations:** Tailwind CSS v4, Framer Motion, Lucide React (Icons)
* **Forms & Validation:** React Hook Form, `@hookform/resolvers/zod`, Zod
* **Data Visualization:** Recharts
* **Routing:** React Router DOM v6

### Backend
* **Core:** Node.js, Express.js
* **Database & ORM:** MongoDB, Mongoose
* **Authentication:** JSON Web Tokens (JWT), bcryptjs
* **Security:** `helmet`, `express-rate-limit`, `cookie-parser`, `cors`
* **Validation:** Zod
* **AI Integration:** Google Generative AI (Gemini) / OpenAI SDK

---

## 📸 Application Highlights

* **Admin Dashboard:** Exclusive administrative portal rendering real-time system metrics (total system balance across all nodes, total circulation volume, aggregate user count) alongside a comprehensive user directory.
* **Request Money Workflow:** Distinct pipeline for inbound money requests integrated securely with the transaction architecture.
* **Seamless API Interception:** A robust Axios layer utilizing response interceptors unconditionally attaches credentials to cross-origin requests, enforcing session continuity.

---

## 💻 Local Setup & Installation

Follow these instructions to run the project on your local machine.

### Prerequisites
* Node.js (v18 or higher recommended)
* MongoDB (Local instance or MongoDB Atlas cluster)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd BankOfJonathan-main 3
```

### 2. Backend Setup
```bash
cd Backend
npm install
```
**Environment Variables:**
Create a `.env` file in the `Backend` directory and define the following variables:
```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/bank_of_jonathan
JWT_SECRET_KEY=your_super_secret_jwt_key
OPENAI_API_KEY=your_api_key_here
NODE_ENV=development
```
**Start the Backend Server:**
```bash
npm run dev
# or: node server.js
```

### 3. Frontend Setup
```bash
cd Frontend/SmartBank
npm install
```
**Start the Frontend Vite Server:**
```bash
npm run dev
```

The application will typically be accessible at `http://localhost:5173`. 

*(Optional) Promoting a User to Admin:*
To access the Admin Dashboard, register a new user, connect to your MongoDB instance (via Compass or CLI), and manually update that user document's `role` property to `"admin"`.

---

## 📝 License
This project is open-source and ready for portfolio usage.
