package ai.hiresense.service;

import ai.hiresense.dto.CandidateDto;
import ai.hiresense.entity.Job;
import ai.hiresense.exception.BadRequestException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.ByteArrayOutputStream;

import static org.junit.jupiter.api.Assertions.*;

class ResumeTextServiceTest {

    private final ResumeTextService service = new ResumeTextService();

    @Test
    void extractsReadableTextAndFieldsFromPdf() throws Exception {
        byte[] pdf = resumePdf("""
                Priya Nair
                Backend Engineer
                priya.nair@example.com
                +1 415 555 0148
                6 years of experience
                Skills
                Java Spring PostgreSQL
                Education
                BSc Computer Science, State University
                Experience
                Built hiring APIs and screening workflows.
                """);

        MockMultipartFile file = new MockMultipartFile("file", "priya-nair.pdf", "application/pdf", pdf);
        CandidateDto parsed = service.readResume(file);

        assertFalse(parsed.getSummary().contains("\u0000"));
        assertTrue(parsed.getSummary().contains("Priya Nair"));
        assertTrue(parsed.getSummary().contains("PostgreSQL"));
        assertEquals("Priya Nair", parsed.getFullName());
        assertEquals("priya.nair@example.com", parsed.getEmail());
        assertEquals(6, parsed.getExperienceYears());
        assertEquals("Backend Engineer", parsed.getCurrentTitle());
        assertEquals(6, parsed.getExperienceYears());
        assertTrue(parsed.getSkills().toLowerCase().contains("java"));
        assertTrue(parsed.getEducation().contains("Computer Science"));
        assertEquals("priya-nair.pdf", parsed.getResumeUrl());
    }

    @Test
    void parsesSheraniResumeWithoutUsingSectionHeadingsAsATitle() throws Exception {
        java.nio.file.Path pdf = java.nio.file.Path.of("C:\\Users\\shera\\OneDrive\\Desktop\\Sherani_Goyal_Resume.pdf");
        org.junit.jupiter.api.Assumptions.assumeTrue(java.nio.file.Files.exists(pdf), "resume pdf is not on this machine");
        byte[] bytes = java.nio.file.Files.readAllBytes(pdf);
        MockMultipartFile file = new MockMultipartFile("file", "Sherani_Goyal_Resume.pdf", "application/pdf", bytes);
        CandidateDto parsed = service.readResume(file);

        assertNotEquals("PROFESSIONAL SUMMARY", parsed.getCurrentTitle());
        assertEquals("Prompt Engineering Intern", parsed.getCurrentTitle());
        assertEquals(0, parsed.getExperienceYears());
        assertEquals("sheranigoyal@gmail.com", parsed.getEmail());
        assertTrue(parsed.getSkills().contains("Java"));
        assertTrue(parsed.getSkills().contains("Node.js"));
        assertTrue(parsed.getSkills().contains("Express.js"));
        assertTrue(parsed.getSkills().contains("MySQL"));
        assertFalse(parsed.getSkills().startsWith("Languages"));
        assertTrue(parsed.getEducation().contains("B.E. Computer Science Engineering"));
        assertTrue(parsed.getEducation().contains("Chitkara University"));
        assertTrue(parsed.getEducation().contains("2028"));

        Job job = new Job(
                "Senior Full-Stack Product Engineer",
                "Engineering",
                "Remote",
                "Full-time",
                "OPEN",
                "Senior (5+ years)",
                "",
                "",
                "React 18+, TypeScript, Tailwind CSS, Java 21, Spring Boot, PostgreSQL, WebSockets."
        );
        AiScreeningService screening = new AiScreeningService(null, null, null, service);
        AiScreeningService.ScreeningResult result = screening.evaluateMatch(parsed, job);
        assertTrue(result.strengths.contains("Skills match: 1 of 7"));
        assertTrue(result.strengths.contains("Java 21"));
        assertTrue(result.concerns.contains("React 18+"));
        assertTrue(result.concerns.contains("PostgreSQL"));
        assertTrue(result.concerns.contains("Spring Boot"));
        assertTrue(result.strengths.contains("Prompt Engineering Intern"));
        assertTrue(result.strengths.contains("does not reject"));
        assertEquals(10, result.score);
        assertEquals("LOW_MATCH", result.recommendation);
    }

    @Test
    void rejectsCorruptPdf() {
        MockMultipartFile file = new MockMultipartFile("file", "broken.pdf", "application/pdf", new byte[]{'%', 'P', 'D', 'F', '-', '1', '.', '4', 0});
        BadRequestException ex = assertThrows(BadRequestException.class, () -> service.readResume(file));
        assertTrue(ex.getMessage().toLowerCase().contains("corrupt") || ex.getMessage().toLowerCase().contains("valid"));
    }

    @Test
    void rejectsScannedPdfWithNoText() throws Exception {
        try (PDDocument document = new PDDocument()) {
            document.addPage(new PDPage());
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            MockMultipartFile file = new MockMultipartFile("file", "scan.pdf", "application/pdf", out.toByteArray());
            BadRequestException ex = assertThrows(BadRequestException.class, () -> service.readResume(file));
            assertTrue(ex.getMessage().toLowerCase().contains("selectable"));
        }
    }

    @Test
    void rejectsUnsupportedType() {
        MockMultipartFile file = new MockMultipartFile("file", "photo.png", "image/png", new byte[]{1, 2, 3});
        BadRequestException ex = assertThrows(BadRequestException.class, () -> service.readResume(file));
        assertTrue(ex.getMessage().toLowerCase().contains("pdf"));
    }

    @Test
    void rejectsBinaryTextSubmission() {
        BadRequestException ex = assertThrows(BadRequestException.class, () -> service.requireReadable("Hello resume\u0000" + "a".repeat(50)));
        assertTrue(ex.getMessage().toLowerCase().contains("raw file"));
    }

    private byte[] resumePdf(String text) throws Exception {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);
            try (PDPageContentStream stream = new PDPageContentStream(document, page)) {
                stream.beginText();
                stream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
                stream.setLeading(16);
                stream.newLineAtOffset(50, 720);
                for (String line : text.split("\\R")) {
                    stream.showText(line.isEmpty() ? " " : line);
                    stream.newLine();
                }
                stream.endText();
            }
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            return out.toByteArray();
        }
    }
}
