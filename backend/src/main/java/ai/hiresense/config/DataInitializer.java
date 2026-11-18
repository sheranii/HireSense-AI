package ai.hiresense.config;

import ai.hiresense.entity.*;
import ai.hiresense.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final CandidateRepository candidateRepository;
    private final ApplicationRepository applicationRepository;
    private final AssessmentRepository assessmentRepository;
    private final ActivityLogRepository activityLogRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           JobRepository jobRepository,
                           CandidateRepository candidateRepository,
                           ApplicationRepository applicationRepository,
                           AssessmentRepository assessmentRepository,
                           ActivityLogRepository activityLogRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.candidateRepository = candidateRepository;
        this.applicationRepository = applicationRepository;
        this.assessmentRepository = assessmentRepository;
        this.activityLogRepository = activityLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedJobsAndCandidates();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            User recruiter = new User(
                    "recruiter@hiresense.ai",
                    passwordEncoder.encode("password123"),
                    "Sarah Chen",
                    Role.ROLE_RECRUITER,
                    "Principal Talent Partner",
                    "Engineering & AI"
            );

            User candidate = new User(
                    "candidate@hiresense.ai",
                    passwordEncoder.encode("password123"),
                    "Alex Rivera",
                    Role.ROLE_CANDIDATE,
                    "Senior Full-Stack Engineer",
                    "Engineering"
            );

            User admin = new User(
                    "admin@hiresense.ai",
                    passwordEncoder.encode("password123"),
                    "Elena Rostova",
                    Role.ROLE_ADMIN,
                    "Head of People Operations",
                    "Executive"
            );

            userRepository.saveAll(Arrays.asList(recruiter, candidate, admin));
        }
    }

    private void seedJobsAndCandidates() {
        if (jobRepository.count() == 0) {
            Job job1 = new Job(
                    "Staff AI Platform Engineer",
                    "Engineering",
                    "San Francisco, CA (Hybrid)",
                    "Full-time",
                    "OPEN",
                    "Senior / Staff (7+ years)",
                    "$190,000 - $240,000",
                    "Architect high-throughput LLM inference pipelines, vector retrieval indexing, and low-latency evaluation infrastructure.",
                    "Python, Rust, PyTorch, Ray, PostgreSQL, pgvector, Kubernetes, Distributed Systems."
            );
            job1.setApplicantCount(1);

            Job job2 = new Job(
                    "Senior Full-Stack Product Engineer",
                    "Engineering",
                    "Remote (US / Europe)",
                    "Full-time",
                    "OPEN",
                    "Senior (5+ years)",
                    "$160,000 - $195,000",
                    "Build high-craft collaboration workflows with React, TypeScript, and Java / Spring Boot. Own candidate evaluation and screening UX.",
                    "React 18+, TypeScript, Tailwind CSS, Java 21, Spring Boot, PostgreSQL, WebSockets."
            );
            job2.setApplicantCount(2);

            Job job3 = new Job(
                    "Lead Product Designer (Design Systems)",
                    "Design",
                    "New York, NY",
                    "Full-time",
                    "OPEN",
                    "Lead (6+ years)",
                    "$165,000 - $200,000",
                    "Drive precision visual language, information-dense table layouts, keyboard shortcuts, and minimal aesthetic systems.",
                    "Figma, Design Systems, Typography, Interaction Design, Linear-style density."
            );
            job3.setApplicantCount(1);

            Job job4 = new Job(
                    "Director of Technical Recruiting",
                    "Talent Operations",
                    "Remote",
                    "Full-time",
                    "OPEN",
                    "Director (8+ years)",
                    "$175,000 - $220,000",
                    "Scale technical recruiting operations, implement AI-first screening pipelines, and manage recruiter capacity metrics.",
                    "ATS Operations, Executive Hiring, Talent Analytics, AI Pipeline Automation."
            );
            job4.setApplicantCount(1);

            List<Job> savedJobs = jobRepository.saveAll(Arrays.asList(job1, job2, job3, job4));

            // Seed Candidates
            Candidate c1 = new Candidate(
                    "Alex Rivera",
                    "alex.rivera@example.com",
                    "+1 (415) 890-2341",
                    "Senior Full-Stack Engineer",
                    "San Francisco, CA",
                    6,
                    "React, TypeScript, Java 21, Spring Boot, PostgreSQL, Docker, AWS",
                    "Full-stack engineer with 6 years experience building developer tools and SaaS platforms with high-density UI and resilient Java services.",
                    94,
                    "HIGH_MATCH",
                    "Exceptional overlap in React, TypeScript, and Spring Boot; strong track record in design-system scale.",
                    "Limited direct experience with Kubernetes orchestration in production.",
                    "INTERVIEW"
            );

            Candidate c2 = new Candidate(
                    "Marcus Vance",
                    "marcus.v@example.com",
                    "+1 (206) 441-9872",
                    "Staff AI Research Engineer",
                    "Seattle, WA",
                    8,
                    "Python, PyTorch, Rust, Ray, pgvector, LLM Fine-Tuning, Distributed Systems",
                    "Ex-DeepMind contributor specializing in token efficiency, real-time evaluation frameworks, and high-performance vector retrieval.",
                    96,
                    "HIGH_MATCH",
                    "Outstanding deep learning infrastructure background; directly addresses inference throughput goals.",
                    "Compensation expectations near upper band limit.",
                    "TECHNICAL"
            );

            Candidate c3 = new Candidate(
                    "Maya Patel",
                    "maya.patel@example.com",
                    "+1 (646) 332-1190",
                    "Senior Design Systems Engineer",
                    "New York, NY",
                    5,
                    "Figma, React, Tailwind CSS, Token Systems, Micro-interactions",
                    "Passionate design systems creator with experience building multi-brand component libraries and accessible data grids.",
                    89,
                    "HIGH_MATCH",
                    "Strong eye for typography and compact information density; excellent communication.",
                    "Looking strictly for hybrid/onsite in NYC.",
                    "SCREENING"
            );

            Candidate c4 = new Candidate(
                    "David Sterling",
                    "david.sterling@example.com",
                    "+1 (512) 774-2091",
                    "Backend Software Engineer",
                    "Austin, TX",
                    4,
                    "Java, Spring Cloud, Kafka, PostgreSQL, Redis",
                    "Reliable backend developer focused on transactional integrity, API versioning, and database indexing strategies.",
                    76,
                    "MODERATE_MATCH",
                    "Solid core Java and relational database fundamentals.",
                    "Needs additional frontend exposure to meet full-stack scope.",
                    "APPLIED"
            );

            Candidate c5 = new Candidate(
                    "Claire Fontaine",
                    "claire.fontaine@example.com",
                    "+44 20 7946 0912",
                    "VP of Talent Acquisition",
                    "London, UK",
                    9,
                    "Global Hiring, Talent Analytics, AI Workflows, Executive Search",
                    "Recruitment leader who scaled engineering headcount from 30 to 250 across EMEA and North America.",
                    92,
                    "HIGH_MATCH",
                    "Demonstrated scaling experience in hyper-growth AI organizations.",
                    "Timezone differences for US-centric team leadership.",
                    "OFFER"
            );

            List<Candidate> savedCandidates = candidateRepository.saveAll(Arrays.asList(c1, c2, c3, c4, c5));

            // Seed Applications
            Application app1 = new Application(savedJobs.get(1), savedCandidates.get(0), "INTERVIEW", 94, "Passed round 1 tech screen. Strong feedback on system architecture and code cleanliness.");
            Application app2 = new Application(savedJobs.get(0), savedCandidates.get(1), "TECHNICAL", 96, "Live coding evaluation scheduled for Thursday with Platform team.");
            Application app3 = new Application(savedJobs.get(2), savedCandidates.get(2), "SCREENING", 89, "Initial portfolio review completed by Design Lead. Recommended for interview.");
            Application app4 = new Application(savedJobs.get(1), savedCandidates.get(3), "APPLIED", 76, "AI Screening matched 76%. Pending recruiter review.");
            Application app5 = new Application(savedJobs.get(3), savedCandidates.get(4), "OFFER", 92, "Offer letter generated. Compensation package sent for final approval.");

            applicationRepository.saveAll(Arrays.asList(app1, app2, app3, app4, app5));

            // Seed Assessments
            Assessment a1 = new Assessment(savedCandidates.get(0), savedJobs.get(1).getTitle(), "Technical Architecture", 92, 100, "COMPLETED", "Demonstrated advanced mastery of state modeling and resilient API boundaries.");
            Assessment a2 = new Assessment(savedCandidates.get(1), savedJobs.get(0).getTitle(), "AI Systems & Inference", 97, 100, "COMPLETED", "Flawless implementation of batched tensor caching and KV-cache compression.");
            Assessment a3 = new Assessment(savedCandidates.get(2), savedJobs.get(2).getTitle(), "Design Systems Challenge", 88, 100, "COMPLETED", "Clean tokens architecture with keyboard accessibility navigation.");
            Assessment a4 = new Assessment(savedCandidates.get(3), savedJobs.get(1).getTitle(), "Full-Stack Coding Test", 74, 100, "COMPLETED", "Backend solutions were optimal; frontend submission lacked responsive states.");

            assessmentRepository.saveAll(Arrays.asList(a1, a2, a3, a4));

            // Seed Demonstration Activity Logs
            ActivityLog log1 = new ActivityLog("[Sample] Candidate Stage Updated", "Application stage moved to Offer during pipeline review", "CANDIDATE", "Sarah Chen", "Principal Talent Partner");
            ActivityLog log2 = new ActivityLog("[Sample] Screening Result Recorded", "Resume evaluated against job requirements with 94% match score", "AI_SCREENING", "HireSense Engine", "System");
            ActivityLog log3 = new ActivityLog("[Sample] Assessment Completed", "Candidate submitted Technical Architecture challenge (92/100)", "ASSESSMENT", "Assessment Service", "System");
            ActivityLog log4 = new ActivityLog("[Sample] Requisition Created", "Senior Full-Stack Product Engineer opened for applications", "JOB", "Sarah Chen", "Principal Talent Partner");

            activityLogRepository.saveAll(Arrays.asList(log1, log2, log3, log4));
        }
    }
}

