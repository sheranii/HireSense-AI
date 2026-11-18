# HireSense AI — Explainable Recruitment & Talent Management Platform

**A full-stack recruitment platform designed to make hiring workflows more structured, transparent, and data-driven.**

HireSense AI brings job management, candidate profiles, resume screening, application tracking, and recruitment analytics into one centralized workspace.

Rather than treating resume screening as a black-box decision, the platform provides explainable matching results, including matched skills, missing requirements, experience comparisons, and screening recommendations.

---

## Overview

Recruitment teams often manage job postings, candidate information, resumes, and application progress across disconnected tools.

HireSense AI addresses this problem through a centralized platform with dedicated workflows for recruiters, candidates, and administrators.

The system supports the recruitment journey from job creation and candidate application to resume evaluation and application-stage management.

## Key Features

### 1. Recruiter Workspace
- Create, edit, manage, and close job requisitions.
- View candidate profiles and submitted applications.
- Track applications across recruitment stages.
- Add interview notes and update candidate progress.
- Monitor recruitment activity through dashboard metrics.

### 2. Resume Screening & Matching
- Upload PDF resumes and extract readable text.
- Automatically identify candidate information where supported by the resume format.
- Compare candidate skills against job requirements.
- Evaluate stated experience and education requirements.
- Generate explainable screening scores and recommendations.
- Display matching strengths and missing requirements.

**Transparency matters:** The current screening engine uses deterministic, rule-based matching and weighted scoring. It is not presented as an LLM-based or generative AI model.

### 3. Candidate Portal
- Register and manage candidate profiles.
- Explore available job opportunities.
- Submit applications.
- Track application progress.
- Maintain candidate information.

### 4. Application Management
- Prevent duplicate applications for the same job and candidate.
- Track application stages.
- Maintain recruitment notes and application history.
- Keep applicant counts synchronized with application records.

### 5. Admin Dashboard
- Access administrative workspace functionality.
- Monitor users and recruitment activity.
- Review system-level information.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, JavaScript |
| Styling | Tailwind CSS |
| Backend | Java 21, Spring Boot 3 |
| Security | Spring Security, JWT |
| Database | PostgreSQL |
| API Communication | REST APIs |
| Resume Processing | Apache PDFBox |
| Build Tools | Maven, npm |
| Development Tools | Git, GitHub, VS Code |

---

## System Architecture

HireSense AI follows a layered full-stack architecture.

```text
                 React Frontend
                       |
                       | REST API
                       |
              Spring Boot Backend
                       |
          ---------------------------
          |            |            |
       Security     Services    Controllers
          |            |            |
          ---------------------------
                       |
                Repositories
                       |
                  PostgreSQL
```

### Backend Architecture

The backend follows a layered structure:

- **Controllers:** Handle HTTP requests and API responses.
- **Services:** Implement business logic and recruitment workflows.
- **Repositories:** Handle database operations through Spring Data JPA.
- **Entities:** Represent persistent application data.
- **DTOs:** Control the data transferred between frontend and backend.
- **Security:** Protect authenticated endpoints and manage role-based access.

---

## Resume Screening Workflow

1. Recruiter selects an available job.
2. Recruiter uploads a candidate's PDF resume.
3. Apache PDFBox extracts selectable text from the document.
4. The resume-processing service identifies available candidate information.
5. The screening service compares extracted skills and qualifications against job requirements.
6. A weighted score and screening explanation are generated.
7. Candidate and application records are persisted in PostgreSQL.
8. Recruiters can review the result and continue managing the application.

The score is intended as a decision-support signal, not an automatic hiring or rejection decision.

---

## Database Design

The application uses PostgreSQL for persistent storage.

Core domain entities include:

- Users
- Candidates
- Jobs
- Applications
- Assessments

The database supports relationships between recruiters, job requisitions, candidate profiles, and applications.

---

## Running the Project Locally

### Prerequisites

- Java 21
- Node.js and npm
- PostgreSQL 16 or compatible version
- Git

### 1. Clone the repository

```bash
git clone https://github.com/sheranii/HireSense-AI.git
cd HireSense-AI
```

### 2. Configure PostgreSQL

Create a PostgreSQL database:

```sql
CREATE DATABASE hiresense_db;
```

Configure the database URL, username, and password in the backend application configuration.

Keep credentials outside version control. Do not commit production secrets.

### 3. Start the backend

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

### 4. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

## Engineering Highlights

The project focuses on practical full-stack engineering concepts:

- Designing RESTful APIs using Spring Boot.
- Implementing JWT-based authentication and authorization.
- Structuring backend code using controllers, services, repositories, DTOs, and entities.
- Managing relational data using PostgreSQL and JPA.
- Processing PDF resumes using Apache PDFBox.
- Implementing explainable rule-based matching and weighted scoring.
- Handling application lifecycle and duplicate-submission checks.
- Building reusable React components and role-specific interfaces.
- Integrating frontend workflows with backend APIs.

---

## Future Improvements

- Semantic skill matching using NLP or embedding-based similarity.
- Improved resume parsing across different PDF layouts.
- More comprehensive automated integration and authorization tests.
- Interview scheduling and notification workflows.
- Recruitment funnel analytics and reporting.
- Deployment with production-grade configuration and monitoring.

---

## Project Information

**Project:** HireSense AI  
**Category:** Full-Stack Web Application  
**Backend:** Java, Spring Boot  
**Frontend:** React, Tailwind CSS  
**Database:** PostgreSQL

**Developer:** Sherani Goyal

- GitHub: https://github.com/sheranii
- Project Repository: https://github.com/sheranii/HireSense-AI

---

*HireSense AI is an academic and portfolio engineering project demonstrating full-stack application development, backend architecture, database management, authentication, document processing, and explainable recruitment workflows.*
