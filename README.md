# HireSense AI

> Modern, AI-powered recruitment management and talent intelligence platform built with Java 21, Spring Boot 3.4.2, PostgreSQL 16, React 18, Vite, and Tailwind CSS.

---

## 🌟 Overview

**HireSense AI** is an enterprise-grade applicant tracking and recruitment intelligence platform designed to streamline hiring workflows from requisition to offer. With an editorial, high-density interface inspired by Linear and Ashby, HireSense combines rigorous candidate management with automated AI resume screening and pipeline orchestration.

---

## 🏗️ Architecture & Tech Stack

### Backend
- **Framework**: Java 21 & Spring Boot 3.4.2
- **Security**: Spring Security 6 with stateless JWT authentication
- **Data & Persistence**: Spring Data JPA & Hibernate
- **Database**: PostgreSQL 16
- **Build & Dependency Management**: Apache Maven

### Frontend
- **Framework**: React 18 & Vite
- **Styling**: Tailwind CSS with custom slate & indigo design tokens
- **Typography**: Inter (Body & Headings) and JetBrains Mono (Code/Metrics)
- **Icons**: Lucide React
- **Routing**: React Router v6
- **HTTP Client**: Axios with unified interceptors & token injection

---

## 🚀 Key Features

- **Recruiter Command Center**: High-density overview with live requisition counters, stage distribution, and urgent hiring requisitions.
- **Dynamic Requisition Management**: Full lifecycle management of job requisitions (Draft, Open, On Hold, Closed) with live applicant count tracking.
- **Candidate Intelligence Directory**: Multi-criteria candidate evaluation, resume profile inspection, skill matrix, and career timeline.
- **Applicant Pipeline & Review Notes**: Stage progression tracking (Applied, Screening, Interview, Offered, Rejected) with persistent recruiter interview feedback.
- **AI Resume Screening**: Multi-factor candidate-job match scoring analyzing technical skills, years of experience, and role alignment.
- **Public Careers & Application Portal**: Candidate-facing job board with straightforward submission, skill tags, and resume ingestion.

---

## 🛠️ Project Structure

```text
HireSense_AI/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/hiresense/
│   │   │   │   ├── config/          # Spring Security, JWT & CORS filters
│   │   │   │   ├── controller/      # REST API endpoints
│   │   │   │   ├── dto/             # Request/response DTOs
│   │   │   │   ├── model/           # JPA entities (User, Job, Candidate, Application, Assessment)
│   │   │   │   ├── repository/     # Spring Data JPA repositories
│   │   │   │   └── service/        # Business logic & AI screening engine
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── schema.sql       # Database schema initialization
│   │   └── test/                    # Unit & integration test suite
│   ├── mvnw.cmd
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── api/                     # Axios client & API endpoints
│   │   ├── components/
│   │   │   ├── common/              # Badge, Button, StatCard, PageHeader, Modal, Notice
│   │   │   └── layout/              # AppLayout, Logo, Collapsible Sidebar, Omni-Search
│   │   ├── context/                 # AuthContext & Session management
│   │   ├── pages/                   # Landing, Dashboard, Jobs, Candidates, Applications, Assessments
│   │   ├── App.jsx                  # Route definitions & protected route guards
│   │   ├── index.css                # Base styles & typography
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Java 21 JDK
- Node.js 18+ and npm
- PostgreSQL 16

### 1. Database Setup
Create database `hiresense` in PostgreSQL:
```sql
CREATE DATABASE hiresense;
```

### 2. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
The backend API starts on `http://localhost:8080`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The web application runs on `http://localhost:5173`.

---

## 🔒 API Documentation

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register new recruiter or candidate | Public |
| POST | `/api/auth/login` | Authenticate & retrieve JWT token | Public |
| GET | `/api/jobs` | Retrieve all active job requisitions | Public / Authenticated |
| POST | `/api/jobs` | Create new job requisition | Recruiter |
| GET | `/api/candidates` | Retrieve candidate directory | Recruiter |
| GET | `/api/applications` | Retrieve recruitment pipeline | Recruiter |
| PATCH | `/api/applications/{id}/stage` | Update candidate stage & interview notes | Recruiter |
| POST | `/api/assessments/screen` | Execute AI resume screening analysis | Recruiter |

---

## 📄 License
This project is proprietary software developed for HireSense AI recruitment operations.
