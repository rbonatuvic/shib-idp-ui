package edu.internet2.tier.shibboleth.admin.ui.configuration;

import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.EmailService;
import edu.internet2.tier.shibboleth.admin.ui.service.EmailServiceImpl;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.thymeleaf.templateresolver.ITemplateResolver;

import java.util.Collections;
import java.util.Optional;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@Configuration
@ConfigurationProperties("shibui.mail")
public class EmailConfiguration {

    private static final String EMAIL_TEMPLATE_ENCODING = "UTF-8";

    //Configured via @ConfigurationProperties (using setter method) with 'shibui.mail.text-email-template-path-prefix' property and
    // default value set here if that property is not explicitly set in application.properties
    @Setter
    private String textEmailTemplatePathPrefix = "/mail/text/";

    //Configured via @ConfigurationProperties (using setter method) with 'shibui.mail.html-email-template-path-prefix' property and
    // default value set here if that property is not explicitly set in application.properties
    @Setter
    private String htmlEmailTemplatePathPrefix = "/mail/html/";

    //Configured via @ConfigurationProperties (using setter method) with 'shibui.mail.system-email-address' property and
    // default value set here if that property is not explicitly set in application.properties
    @Setter
    private String systemEmailAddress = "doNotReply@shibui.org";

    @Autowired(required = false)
    private JavaMailSender javaMailSender;

    @Autowired
    private UserRepository userRepository;

    @Bean
    public ResourceBundleMessageSource emailMessageSource() {
        final ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
        messageSource.setBasename("mail/mailMessages");
        return messageSource;
    }

    @Bean
    public TemplateEngine textEmailTemplateEngine() {
        final SpringTemplateEngine templateEngine = new SpringTemplateEngine();
        templateEngine.addTemplateResolver(textTemplateResolver());
        templateEngine.setTemplateEngineMessageSource(emailMessageSource());
        return templateEngine;
    }

    @Bean
    public TemplateEngine htmlEmailTemplateEngine() {
        final SpringTemplateEngine templateEngine = new SpringTemplateEngine();
        templateEngine.addTemplateResolver(htmlTemplateResolver());
        templateEngine.setTemplateEngineMessageSource(emailMessageSource());
        return templateEngine;
    }

    private ITemplateResolver textTemplateResolver() {
        final ClassLoaderTemplateResolver templateResolver = new ClassLoaderTemplateResolver();
        templateResolver.setOrder(1);
        templateResolver.setResolvablePatterns(Collections.singleton("*"));
        templateResolver.setPrefix(textEmailTemplatePathPrefix);
        templateResolver.setSuffix(".txt");
        templateResolver.setTemplateMode(TemplateMode.TEXT);
        templateResolver.setCharacterEncoding(EMAIL_TEMPLATE_ENCODING);
        templateResolver.setCacheable(false);
        return templateResolver;
    }

    private ITemplateResolver htmlTemplateResolver() {
        final ClassLoaderTemplateResolver templateResolver = new ClassLoaderTemplateResolver();
        templateResolver.setOrder(1);
        templateResolver.setResolvablePatterns(Collections.singleton("*"));
        templateResolver.setPrefix(htmlEmailTemplatePathPrefix);
        templateResolver.setSuffix(".html");
        templateResolver.setTemplateMode(TemplateMode.HTML);
        templateResolver.setCharacterEncoding(EMAIL_TEMPLATE_ENCODING);
        templateResolver.setCacheable(false);
        return templateResolver;
    }

    @Bean
    public Optional<EmailService> emailService() {
        if (this.javaMailSender != null) {
            return Optional.of(new EmailServiceImpl(javaMailSender,
                    emailMessageSource(),
                    textEmailTemplateEngine(),
                    htmlEmailTemplateEngine(),
                    systemEmailAddress,
                    userRepository));
        } else {
            return Optional.empty();
        }
    }
}
