# 🚀 QuikAi - Full-Stack Generative AI Production Workspace

QuikAi is a high-performance full-stack SaaS application that leverages advanced Large Language Models (LLMs) and media processing architectures to automate content creation, image manipulation, and technical portfolio optimizations. Built with a decoupled client-server architecture, it delivers text and visual workspaces natively.

---

## 📸 Core Applications Showcase

### 1. Welcome Homepage
The marketing and feature discovery landing frame of the platform.
![Welcome Homepage](./screenShots/HomePage%20(2).png)

### 2. Main Application Dashboard
The core control panel layout housing centralized routing entries to the full feature suite.
![Main Dashboard](./screenShots/Dashboard.png)

### 3. Integrated AI Toolkit Suite
The navigation hub separating specialized copy, media editor, and analysis modules.
![AI Tools Menu](./screenShots/AiTools.png)

### 4. AI Article Generator
An executive-tier copywriting tool that takes prompt variables and targets length distributions dynamically to generate realized, production-ready copy with clean markdown layouts.
![AI Article Generator](./screenShots/articleGeneration.png)

### 5. SEO Headline Copywriter (Blog Titles)
An advanced SEO brainstorming engine that analyzes topics to output 5 click-worthy, engagement-optimized, numbered blog headlines natively.
![Blog Title Generator](./screenShots/BlogTitle.png)

### 6. AI Text-To-Image Canvas Generator
A creative media studio translating descriptive prompts into beautiful digital artwork configurations.
![AI Image Generator](./screenShots/ImageGeneration.png)

### 7. AI Background Cutout Isolation
An automated editing module that strips the background layer off uploaded imagery assets natively.
![AI Background Removal](./screenShots/BackgroundRemoval.png)

### 8. Generative Object Eraser (Inpainting)
An intelligent canvas editor utilizing context-aware generative infilling to mask out specified elements.
![AI Object Removal](./screenShots/ObjectRemoval.png)

### 9. Native PDF Resume Auditor & Reviewer
A portfolio review suite that ingests user-uploaded PDF files, reads the file streams securely as a `Uint8Array` matrix, extracts structural texts, and processes an in-depth constructive recruiter critique.
![AI Resume Auditor](./screenShots/ResumeReview.png)

### 10. Tiered Subscription & Credit Access Plans
Flexible payment mapping tiers handling premium package credit and tool unlocks.
![Pricing Tiers](./screenShots/Plans.png)

### 11. Secure User Profile & Account Metrics
The localized settings drawer monitoring user details, billing tokens, and account creations.
![User Profile Settings](./screenShots/ProfileDet.png)

### 12. Persistent Layout Footer
The global footer signature anchoring secondary legal and resource navigation parameters.
![Layout Footer](./screenShots/Footer.png)

---

## 🛠️ Architecture Stack Configurations

### Frontend Client
- **Framework Suite**: ReactJS (Vite Build Bundle Engine)
- **Styling Utility**: Tailwind CSS (Utility-First Responsive Layouts)
- **Icons**: Lucide React
- **Authentication**: Clerk React SDK Security Layer
- **Network Pipeline**: Axios (JSON Structural Transmissions)

### Backend Core API
- **Runtime Environment**: Node.js Ecosystem Layer
- **REST Framework Wrapper**: Express.js Router Middleware
- **Identity Middleware**: Clerk Express Middleware Configuration
- **Asset Buffer Parser**: Multer File Stream Memory Allocations
- **Document Text Extractor**: PDF-Parse (Cross-Platform Uint8Array Matrix Buffers)
- **Artificial Intelligence Routing**: Google Gemini LLM API (Via OpenAI Integration Wrappers)
- **Primary Persistent Data Store**: PostgreSQL Database Client

---

## ⚙️ Local Development Environment Setup

Follow these setup steps to spin up the local environment clusters on your machine.

### 1. Repository Configuration
Clone the repository down into your computer:
```bash
git clone https://github.com
cd QuikAi
```

### 2. Backend Environment Environment Setup (`/server/.env`)
Create a file named `.env` inside your root `server` folder path and assign these tracking values:
```env
GEMINI_API_KEY=your_google_ai_studio_api_key_string
CLERK_SECRET_KEY=your_clerk_private_secret_token_signature
DATABASE_URL=your_postgresql_connection_string_uri
PORT=5000
```

### 3. Frontend Client Environment Setup (`/client/.env`)
Create a file named `.env` inside your root `client` folder path and assign these tracking variables:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_public_publishable_key_string
VITE_BASE_URL=http://localhost:5000
```

### 4. Dependency Installations & Startup Execution
Open your terminal panel and boot the workspace subsystems concurrently:

```bash
# Terminal Tab A: Spin up the core Server API Layer
cd server
npm install
npm run dev

# Terminal Tab B: Spin up the client User View Framework
cd client
npm install
npm run dev
```

---

## 🔒 Security & Disk Sanitation Disclosures
- **Environment Sanitation**: All private API keys, tokens, and database URI strings are fully locked out of public version control structures using multi-tier `.gitignore` profiles.
- **Disk Space Preservation**: Temporary document upload buffers compiled by the Multer storage layer are instantly unlinked and permanently deleted from physical local server hard drives (`fs.unlinkSync`) immediately after text extraction parsing loops complete to protect system resources and user confidentiality.
