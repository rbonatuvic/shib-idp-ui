package edu.internet2.tier.shibboleth.admin.ui.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.Locale;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class EmailServiceImpl implements EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final String systemEmailAddress;
    private JavaMailSender emailSender;
    private ResourceBundleMessageSource emailMessageSource;
    private TemplateEngine textEmailTemplateEngine;
    private TemplateEngine htmlEmailTemplateEngine;

    public EmailServiceImpl(JavaMailSender emailSender,
                            ResourceBundleMessageSource emailMessageSource,
                            TemplateEngine textEmailTemplateEngine,
                            TemplateEngine htmlEmailTemplateEngine,
                            String systemEmailAddress) {
        this.emailSender = emailSender;
        this.emailMessageSource = emailMessageSource;
        this.textEmailTemplateEngine = textEmailTemplateEngine;
        this.htmlEmailTemplateEngine = htmlEmailTemplateEngine;
        this.systemEmailAddress = systemEmailAddress;
    }

    public void sendMail(String emailTemplate, String fromAddress, String[] recipients, String subject, Locale locale) throws MessagingException {
        Context context = new Context(locale);
        // TODO: set things to be replaced in the email template here

        MimeMessage mimeMessage = this.emailSender.createMimeMessage();
        MimeMessageHelper message = new MimeMessageHelper(mimeMessage, true,"UTF-8");
        message.setSubject(subject);
        message.setFrom(fromAddress);
        message.setTo(recipients);

        String textContent = textEmailTemplateEngine.process(emailTemplate, context);
        String htmlContent = htmlEmailTemplateEngine.process(emailTemplate, context);
        message.setText(textContent, htmlContent);

        // TODO: Uncomment when we're ready to actually send emails
        emailSender.send(mimeMessage);
    }

    public void sendNewUserMail(String newUsername) throws MessagingException {
        String subject = String.format("User Access Request for %s", newUsername);
        sendMail("new-user", systemEmailAddress, getSystemAdmins(), subject, Locale.getDefault());
    }

    private String[] getSystemAdmins() {
        return new String[]{"admin1@shibui.org", "admin2@shibui.org"};
    }
}
