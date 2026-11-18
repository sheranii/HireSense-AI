package ai.hiresense.service;

import ai.hiresense.dto.CandidateDto;
import ai.hiresense.exception.BadRequestException;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.encryption.InvalidPasswordException;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeTextService {

    public static final long MAX_BYTES = 5L * 1024 * 1024;
    private static final int MIN_LETTERS = 40;

    private static final Pattern EMAIL = Pattern.compile("[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}", Pattern.CASE_INSENSITIVE);
    private static final Pattern PHONE = Pattern.compile("(?<!\\d)(?:\\+?\\d[\\d\\s().-]{7,}\\d)");
    private static final Pattern STATED_YEARS = Pattern.compile("(\\d{1,2})\\s*\\+?\\s*years?\\s+of\\s+(?:professional\\s+|work\\s+|industry\\s+)?experience", Pattern.CASE_INSENSITIVE);
    private static final Pattern NAME = Pattern.compile("^[A-Z][\\p{L}.'-]+(?:\\s+[A-Z][\\p{L}.'-]+){1,3}$");
    private static final Pattern DATE_RANGE = Pattern.compile(
            "(?i)(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\\s+(\\d{4})\\s*(?:-|–|—|−|to|\\u2010|\\u2011|\\u2012|\\u2013|\\u2014|\\u2015)\\s*(present|current|now|(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\\s+(\\d{4}))");
    private static final Pattern YEAR = Pattern.compile("\\b(19|20)\\d{2}\\b");
    private static final Pattern DEGREE = Pattern.compile("(?i)\\b(b\\.?e\\.?|b\\.?tech|b\\.?sc|bsc|bachelor(?:'s)?|m\\.?tech|m\\.?sc|msc|master(?:'s)?|ph\\.?d|diploma|b\\.?a\\.?|m\\.?a\\.?)\\b.*");

    private static final Set<String> HEADINGS = Set.of(
            "professional summary", "summary", "objective", "profile", "about", "about me",
            "education", "academic", "academics",
            "experience", "work experience", "professional experience", "employment", "work history",
            "internship", "internships",
            "projects", "personal projects", "academic projects",
            "skills", "technical skills", "core skills", "key skills",
            "certifications", "certifications achievements", "achievements", "awards",
            "tools", "languages", "interests", "references", "contact"
    );

    public CandidateDto readResume(MultipartFile file) {
        String extracted = extractPdfText(file);
        return parse(extracted, file.getOriginalFilename());
    }

    public String extractPdfText(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Choose a PDF resume before screening.");
        }
        if (file.getSize() > MAX_BYTES) {
            throw new BadRequestException("That file is larger than 5 MB. Upload a smaller PDF.");
        }
        String name = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase(Locale.ROOT);
        String type = file.getContentType() == null ? "" : file.getContentType().toLowerCase(Locale.ROOT);
        boolean pdfName = name.endsWith(".pdf");
        boolean pdfType = type.equals("application/pdf") || type.equals("application/x-pdf");
        if (!pdfName && !pdfType) {
            throw new BadRequestException("Only PDF resumes can be uploaded here. Paste a text resume, or upload a .pdf file.");
        }
        if (name.endsWith(".doc") || name.endsWith(".docx") || name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg")) {
            throw new BadRequestException("That file type is not supported. Upload a PDF with selectable text.");
        }

        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException ex) {
            throw new BadRequestException("The uploaded file could not be read.");
        }
        if (bytes.length < 5 || bytes[0] != '%' || bytes[1] != 'P' || bytes[2] != 'D' || bytes[3] != 'F') {
            throw new BadRequestException("That file is not a valid PDF.");
        }

        try (PDDocument document = Loader.loadPDF(bytes)) {
            if (document.getNumberOfPages() == 0) {
                throw new BadRequestException("This PDF has no pages.");
            }
            PDFTextStripper stripper = new PDFTextStripper();
            String text = sanitize(stripper.getText(document));
            if (!isReadable(text)) {
                throw new BadRequestException("This PDF has no selectable text. It may be a scanned image. Upload a text-based PDF or paste the resume.");
            }
            return text;
        } catch (InvalidPasswordException ex) {
            throw new BadRequestException("This PDF is password protected and cannot be read.");
        } catch (BadRequestException ex) {
            throw ex;
        } catch (IOException ex) {
            throw new BadRequestException("This PDF is corrupted or could not be opened.");
        }
    }

    public CandidateDto parse(String resumeText, String fileName) {
        String text = requireReadable(resumeText);
        CandidateDto dto = new CandidateDto();
        dto.setSummary(text);
        dto.setResumeUrl(sanitize(fileName));

        Matcher email = EMAIL.matcher(text);
        if (email.find()) dto.setEmail(email.group());

        Matcher phone = PHONE.matcher(text);
        if (phone.find()) dto.setPhone(phone.group().trim());

        List<String> lines = lines(text);
        for (String line : lines) {
            if (dto.getFullName() == null && NAME.matcher(line).matches() && !isHeading(line)) {
                dto.setFullName(line);
                break;
            }
        }

        ExperienceProfile experience = experience(text);
        dto.setExperienceYears(experience.professionalYears);
        dto.setCurrentTitle(experience.currentTitle);
        if (dto.getCurrentTitle() == null) {
            dto.setCurrentTitle(headerTitle(lines));
        }
        dto.setSkills(String.join(", ", skillList(text)));
        dto.setEducation(education(text));
        return dto;
    }

    public boolean isHeading(String line) {
        if (line == null || line.isBlank()) return false;
        String normalized = normalizeHeading(line);
        if (normalized.isEmpty() || normalized.length() > 40) return false;
        return HEADINGS.contains(normalized);
    }

    public ExperienceProfile experience(String resumeText) {
        ExperienceProfile profile = new ExperienceProfile();
        List<String> lines = lines(resumeText);
        String section = "";
        String previous = "";
        for (String line : lines) {
            if (isHeading(line)) {
                section = normalizeHeading(line);
                previous = "";
                continue;
            }
            boolean employment = section.contains("experience") || section.contains("employment") || section.contains("internship");
            boolean project = section.contains("project");
            Matcher range = DATE_RANGE.matcher(line);
            if (employment && range.find()) {
                int months = monthsBetween(range);
                String role = line.substring(0, range.start()).replaceAll("[|•·\\-–—]+$", "").trim();
                if (role.isBlank()) role = previous;
                boolean internship = section.contains("internship") || role.toLowerCase(Locale.ROOT).contains("intern");
                String detail = (role.isBlank() ? "Role not labeled" : role) + ", " + range.group().replaceAll("\\s+", " ") + " (" + months + (months == 1 ? " month)" : " months)");
                if (internship) {
                    profile.internshipMonths += months;
                    profile.internships.add(detail);
                    if (profile.currentTitle == null && !role.isBlank() && !isHeading(role)) profile.currentTitle = role;
                } else {
                    profile.professionalMonths += months;
                    profile.roles.add(detail);
                    if (profile.currentTitle == null && !role.isBlank() && !isHeading(role)) profile.currentTitle = role;
                }
            } else if (project && profile.projects.size() < 6 && line.length() <= 90 && !line.startsWith("•") && !line.startsWith("-") && !line.toLowerCase(Locale.ROOT).startsWith("github")) {
                profile.projects.add(line);
            }
            previous = line;
        }
        profile.professionalYears = profile.professionalMonths / 12;
        if (profile.professionalMonths == 0) {
            Matcher stated = STATED_YEARS.matcher(resumeText);
            if (stated.find() && profile.internships.isEmpty()) {
                profile.professionalYears = Integer.parseInt(stated.group(1));
                profile.statedYears = true;
            }
        }
        return profile;
    }

    public List<String> skillList(String resumeText) {
        Set<String> skills = new LinkedHashSet<>();
        List<String> lines = lines(resumeText);
        boolean inSkills = false;
        for (String line : lines) {
            if (isHeading(line)) {
                String heading = normalizeHeading(line);
                inSkills = heading.contains("skill") || heading.equals("tools") || heading.equals("languages");
                continue;
            }
            if (!inSkills) continue;
            String body = line;
            int colon = line.indexOf(':');
            if (colon >= 0) body = line.substring(colon + 1);
            for (String part : body.split("[,;|•·]")) {
                String skill = part.replaceAll("\\s+", " ").trim();
                if (skill.length() < 1 || skill.length() > 40) continue;
                if (skill.matches("(?i)and|or|with|using")) continue;
                skills.add(skill);
            }
        }
        return new ArrayList<>(skills);
    }

    public String education(String resumeText) {
        List<String> block = sectionLines(resumeText, "education", "academic", "academics");
        if (block.isEmpty()) return null;
        String degree = null;
        String school = null;
        String when = null;
        String grade = null;
        for (String line : block) {
            Matcher degreeMatch = DEGREE.matcher(line);
            if (degree == null && degreeMatch.find()) {
                degree = line.replaceAll("(?i)\\s*cgpa\\s*:.*", "").trim();
            }
            if (school == null && line.matches("(?i).*(university|college|institute|school).*")) {
                school = line.replaceAll("(?i)\\s*(expected|graduated)?\\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\\s+(19|20)\\d{2}.*", "").trim();
                school = school.replaceAll("[,|]+$", "").trim();
            }
            Matcher expected = Pattern.compile("(?i)expected\\s+[A-Za-z]*\\s*((19|20)\\d{2})").matcher(line);
            if (when == null && expected.find()) when = "expected " + expected.group(1);
            if (when == null) {
                Matcher year = YEAR.matcher(line);
                if (year.find() && line.toLowerCase(Locale.ROOT).contains("graduat")) when = year.group();
            }
            Matcher cgpa = Pattern.compile("(?i)cgpa\\s*:?\\s*([0-9.]+\\s*/\\s*[0-9.]+)").matcher(line);
            if (cgpa.find()) grade = "CGPA " + cgpa.group(1).replaceAll("\\s+", "");
        }
        if (when == null) {
            Matcher expected = Pattern.compile("(?i)expected\\s+[A-Za-z]*\\s*((19|20)\\d{2})").matcher(String.join(" ", block));
            if (expected.find()) when = "expected " + expected.group(1);
        }
        List<String> parts = new ArrayList<>();
        if (degree != null) parts.add(degree);
        if (school != null && (degree == null || !degree.toLowerCase(Locale.ROOT).contains(school.toLowerCase(Locale.ROOT)))) parts.add(school);
        if (when != null) parts.add(when);
        if (grade != null) parts.add(grade);
        if (parts.isEmpty()) return clip(String.join("; ", block), 1500);
        return clip(String.join(", ", parts), 1500);
    }

    private String headerTitle(List<String> lines) {
        boolean seenName = false;
        for (String line : lines) {
            if (!seenName && NAME.matcher(line).matches()) {
                seenName = true;
                continue;
            }
            if (!seenName) continue;
            if (isHeading(line) || line.contains("@") || line.contains("www.") || line.toLowerCase(Locale.ROOT).contains("linkedin")) break;
            if (PHONE.matcher(line).find()) continue;
            return line;
        }
        return null;
    }

    public String requireReadable(String value) {
        String text = sanitize(value);
        if (!isReadable(text)) {
            throw new BadRequestException("The resume text is empty or not readable. Paste the resume, or upload a PDF with selectable text.");
        }
        if (value != null && value.indexOf('\u0000') >= 0) {
            throw new BadRequestException("The resume was sent as raw file data. Upload the PDF as a file instead of pasting it into the text field.");
        }
        return text;
    }

    public String sanitize(String value) {
        if (value == null) return null;
        String cleaned = value.replace("\u0000", "");
        cleaned = cleaned.replaceAll("[\\p{Cntrl}&&[^\\r\\n\\t]]", " ");
        return cleaned.trim();
    }

    public boolean isReadable(String value) {
        if (value == null || value.isBlank()) return false;
        int letters = 0;
        int odd = 0;
        for (int i = 0; i < value.length(); i++) {
            char c = value.charAt(i);
            if (Character.isLetter(c)) letters++;
            else if (c == '\u0000' || c == '\uFFFD') odd++;
        }
        return letters >= MIN_LETTERS && odd == 0;
    }

    private List<String> sectionLines(String text, String... headings) {
        List<String> collected = new ArrayList<>();
        boolean inside = false;
        for (String line : lines(text)) {
            if (isHeading(line)) {
                if (inside) break;
                if (startsSection(line, headings)) inside = true;
                continue;
            }
            if (inside) collected.add(line);
        }
        return collected;
    }

    private boolean startsSection(String line, String... headings) {
        String normalized = normalizeHeading(line);
        for (String heading : headings) {
            if (normalized.equals(heading) || normalized.startsWith(heading + " ")) return true;
        }
        return false;
    }

    private List<String> lines(String text) {
        List<String> lines = new ArrayList<>();
        if (text == null) return lines;
        for (String raw : text.split("\\R")) {
            String line = raw.trim();
            if (!line.isEmpty()) lines.add(line);
        }
        return lines;
    }

    private String normalizeHeading(String line) {
        return line.toLowerCase(Locale.ROOT).replaceAll("[^a-z\\s]", " ").replaceAll("\\s+", " ").trim();
    }

    private int monthsBetween(Matcher range) {
        int start = monthIndex(range.group(1)) + Integer.parseInt(range.group(2)) * 12;
        int end;
        if (range.group(4) == null) {
            java.time.LocalDate today = java.time.LocalDate.now();
            end = today.getMonthValue() + today.getYear() * 12;
        } else {
            end = monthIndex(range.group(4)) + Integer.parseInt(range.group(5)) * 12;
        }
        return Math.max(1, end - start);
    }

    private int monthIndex(String name) {
        String m = name.toLowerCase(Locale.ROOT);
        if (m.startsWith("jan")) return 1;
        if (m.startsWith("feb")) return 2;
        if (m.startsWith("mar")) return 3;
        if (m.startsWith("apr")) return 4;
        if (m.startsWith("may")) return 5;
        if (m.startsWith("jun")) return 6;
        if (m.startsWith("jul")) return 7;
        if (m.startsWith("aug")) return 8;
        if (m.startsWith("sep")) return 9;
        if (m.startsWith("oct")) return 10;
        if (m.startsWith("nov")) return 11;
        return 12;
    }

    private String clip(String value, int max) {
        if (value == null || value.length() <= max) return value;
        return value.substring(0, max);
    }

    public static class ExperienceProfile {
        public int professionalMonths;
        public int professionalYears;
        public int internshipMonths;
        public boolean statedYears;
        public String currentTitle;
        public final List<String> roles = new ArrayList<>();
        public final List<String> internships = new ArrayList<>();
        public final List<String> projects = new ArrayList<>();
    }
}
