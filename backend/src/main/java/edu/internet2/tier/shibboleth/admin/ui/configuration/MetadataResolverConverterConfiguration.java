package edu.internet2.tier.shibboleth.admin.ui.configuration;

import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverConverterService;
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverConverterServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@Configuration
public class MetadataResolverConverterConfiguration {
    @Bean
    public MetadataResolverConverterService metadataResolverConverterService() {
        return new MetadataResolverConverterServiceImpl();
    }
}
