package com.sherani.hiresense.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendApplicationConfirmation(String toEmail, String applicantName,
                                            String jobTitle, String company) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Application Submitted - " + jobTitle + " at " + company);
            message.setText(
                "Dear " + applicantName + ",\n\n" +
                "Your application for " + jobTitle + " at " + company +
                " has been successfully submitted.\n\n" +
                "Status: PENDING\n\n" +
                "Best regards,\nHireSense AI Team"
            );
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send application confirmation email to {}: {}", toEmail, e.getMessage());
        }
    }

    public void sendStatusUpdateEmail(String toEmail, String applicantName,
                                      String jobTitle, String status) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Application Update - " + jobTitle);
            message.setText(
                "Dear " + applicantName + ",\n\n" +
                "Your application for " + jobTitle + " has been " + status + ".\n\n" +
                "Best regards,\nHireSense AI Team"
            );
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send status update email to {}: {}", toEmail, e.getMessage());
        }
    }
}
