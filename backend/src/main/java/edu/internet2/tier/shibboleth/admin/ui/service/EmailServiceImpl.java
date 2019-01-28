package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

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
    private UserRepository userRepository;

    public EmailServiceImpl(JavaMailSender emailSender,
                            ResourceBundleMessageSource emailMessageSource,
                            TemplateEngine textEmailTemplateEngine,
                            TemplateEngine htmlEmailTemplateEngine,
                            String systemEmailAddress,
                            UserRepository userRepository) {
        this.emailSender = emailSender;
        this.emailMessageSource = emailMessageSource;
        this.textEmailTemplateEngine = textEmailTemplateEngine;
        this.htmlEmailTemplateEngine = htmlEmailTemplateEngine;
        this.systemEmailAddress = systemEmailAddress;
        this.userRepository = userRepository;
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

        emailSender.send(mimeMessage);
    }

    public void sendNewUserMail(String newUsername) throws MessagingException {
        String subject = String.format("User Access Request for %s", newUsername);
        sendMail("new-user", systemEmailAddress, getSystemAdminEmailAddresses(), subject, Locale.getDefault());
    }

    public String[] getSystemAdminEmailAddresses() {
        Set<User> systemAdmins = userRepository.findByRoles_Name("ROLE_ADMIN");
        if (systemAdmins == null || systemAdmins.size() == 0) {
            //TODO: Should this be an exception?
            logger.warn("No users with ROLE_ADMIN were found! Check your configuration!");
            systemAdmins = new HashSet<>();
        }
        return systemAdmins.stream().filter(user -> StringUtils.isNotBlank(user.getEmailAddress())).map(User::getEmailAddress).distinct().toArray(String[]::new);
    }
}
