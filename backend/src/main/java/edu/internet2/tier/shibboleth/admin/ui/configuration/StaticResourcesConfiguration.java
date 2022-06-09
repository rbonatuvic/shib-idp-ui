package edu.internet2.tier.shibboleth.admin.ui.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.WebProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;
import java.util.Arrays;

/**
 * class for helping angular work. inspired by https://blog.jdriven.com/2016/10/integrate-angular-spring-boot-gradle/
 */

@Configuration
@EnableConfigurationProperties({WebProperties.class})
public class StaticResourcesConfiguration implements WebMvcConfigurer {
    static final String[] STATIC_RESOURCES = new String[]{
            "/**/*.css",
            "/**/*.html",
            "/**/*.js",
            "/**/*.json",
            "/**/*.bmp",
            "/**/*.jpeg",
            "/**/*.jpg",
            "/**/*.png",
            "/**/*.ttf",
            "/**/*.eot",
            "/**/*.svg",
            "/**/*.woff",
            "/**/*.woff2"
    };

    @Autowired
    private WebProperties resourceProperties = new WebProperties();

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        registry.addResourceHandler(STATIC_RESOURCES)
                .addResourceLocations(resourceProperties.getResources().getStaticLocations())
                .setCachePeriod(10);
        registry.addResourceHandler("/**")
                .addResourceLocations(
                        Arrays.stream(resourceProperties.getResources().getStaticLocations())
                                .map(l -> l + "index.html")
                                .toArray(String[]::new)
                )
                .setCachePeriod(10)
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                                 @Override
                                 protected Resource getResource(String resourcePath, Resource location) throws IOException {
                                     return location.exists() && location.isReadable() ? location : null;
                                 }
                             }
                );
    }
}