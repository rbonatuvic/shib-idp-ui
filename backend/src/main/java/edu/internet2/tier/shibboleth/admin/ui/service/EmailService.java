package edu.internet2.tier.shibboleth.admin.ui.service;

import javax.mail.MessagingException;
import java.util.Locale;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public interface EmailService {
    void sendMail(String emailTemplate, String fromAddress, String[] recipients, String subject, Locale locale) throws MessagingException;
    void sendNewUserMail(String newUsername) throws MessagingException;
}
