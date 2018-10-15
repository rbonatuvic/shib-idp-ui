package edu.internet2.tier.shibboleth.admin.ui.configuration;

import edu.internet2.tier.shibboleth.admin.ui.jsonschema.MetadataSourcesJsonSchemaResourceLocation;
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.RelyingPartyOverridesJsonSchemaValidatingControllerAdvice;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ResourceLoader;

/**
 * @author Dmitriy Kopylenko
 */
@Configuration
public class JsonSchemaValidationComponentsConfiguration {

    @Bean
    public MetadataSourcesJsonSchemaResourceLocation metadataSourcesJsonSchemaResourceLocation(ResourceLoader resourceLoader) {
        return new MetadataSourcesJsonSchemaResourceLocation(resourceLoader);
    }

    @Bean
    public RelyingPartyOverridesJsonSchemaValidatingControllerAdvice relyingPartyOverridesJsonSchemaValidatingControllerAdvice() {
        return new RelyingPartyOverridesJsonSchemaValidatingControllerAdvice();
    }
}
