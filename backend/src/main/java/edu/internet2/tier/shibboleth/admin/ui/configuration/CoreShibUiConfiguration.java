package edu.internet2.tier.shibboleth.admin.ui.configuration;

import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityIdsSearchResultRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolversPositionOrderContainer;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolversPositionOrderContainerRepository;
import edu.internet2.tier.shibboleth.admin.ui.scheduled.EntityDescriptorFilesScheduledTasks;
import edu.internet2.tier.shibboleth.admin.ui.service.*;
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.store.Directory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.util.UrlPathHelper;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class CoreShibUiConfiguration {
    private static final Logger logger = LoggerFactory.getLogger(CoreShibUiConfiguration.class);

    @Value("${shibui.metadata-dir:/opt/shibboleth-idp/metadata/generated}")
    private String metadataDir;

    @Bean
    public OpenSamlObjects openSamlObjects() {
        return new OpenSamlObjects();
    }

    @Bean
    public EntityService jpaEntityService() {
        return new JPAEntityServiceImpl(openSamlObjects());
    }

    @Bean
    public EntityDescriptorService jpaEntityDescriptorService() {
        return new JPAEntityDescriptorServiceImpl(openSamlObjects(), jpaEntityService());
    }

    @Bean
    public FilterService jpaFilterService() {
        return new JPAFilterServiceImpl();
    }

    @Bean
    public FilterTargetService jpaFilterTargetService() {
        return new JPAFilterTargetServiceImpl();
    }

    @Bean
    public MetadataResolverService metadataResolverService() {
        return new JPAMetadataResolverServiceImpl();
    }

    @Bean
    public AttributeUtility attributeUtility() {
        return new AttributeUtility(openSamlObjects());
    }

    @Autowired
    Analyzer fullTokenAnalyzer;

    @Autowired
    Directory directory;

    @Autowired
    LocaleResolver localeResolver;

    @Autowired
    ResourceBundleMessageSource messageSource;

    @Bean
    public EntityDescriptorFilesScheduledTasks entityDescriptorFilesScheduledTasks(EntityDescriptorRepository entityDescriptorRepository) {
        return new EntityDescriptorFilesScheduledTasks(this.metadataDir, entityDescriptorRepository, openSamlObjects());
    }

    @Bean
    public EntityIdsSearchService entityIdsSearchService() {
        return (term, limit) -> {
            List<String> entityIds = new ArrayList<>();
            try {
                IndexSearcher searcher = new IndexSearcher(DirectoryReader.open(directory));
                QueryParser parser = new QueryParser("content", fullTokenAnalyzer);
                TopDocs topDocs = searcher.search(parser.parse(term.trim()), limit);
                for (ScoreDoc scoreDoc : topDocs.scoreDocs) {
                    Document document = searcher.doc(scoreDoc.doc);
                    entityIds.add(document.get("id"));
                }
            } catch (IOException | ParseException e) {
                logger.error(e.getMessage(), e);
            }
            return new EntityIdsSearchResultRepresentation(entityIds);
        };
    }

    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        LocaleChangeInterceptor localeChangeInterceptor = new LocaleChangeInterceptor();
        localeChangeInterceptor.setParamName("lang");
        return localeChangeInterceptor;
    }

    /**
     * A WebMvcConfigurer that won't mangle the path for the entities endpoint.
     *
     * inspired by [ https://stackoverflow.com/questions/13482020/encoded-slash-2f-with-spring-requestmapping-path-param-gives-http-400 ]
     *
     * @return configurer
     */
    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void configurePathMatch(PathMatchConfigurer configurer) {
                UrlPathHelper helper = new UrlPathHelper() {
                    @Override
                    public String getServletPath(HttpServletRequest request) {
                        String servletPath = getOriginatingServletPath(request);
                        if (servletPath.startsWith("/api/entities")) {
                            return servletPath;
                        } else {
                            return super.getOriginatingServletPath(request);
                        }
                    }

                    @Override
                    public String getOriginatingServletPath(HttpServletRequest request) {
                        String servletPath = request.getRequestURI().substring(request.getContextPath().length());
                        if (servletPath.startsWith("/api/entities")) {
                            return servletPath;
                        } else {
                            return super.getOriginatingServletPath(request);
                        }
                    }
                };
                helper.setUrlDecode(false);
                configurer.setUrlPathHelper(helper);
            }

            @Override
            public void addInterceptors(InterceptorRegistry registry) {
                registry.addInterceptor(localeChangeInterceptor());
            }
        };
    }

    @Bean
    public MetadataResolversPositionOrderContainerService
        metadataResolversPositionOrderContainerService(MetadataResolversPositionOrderContainerRepository
                                                               positionOrderContainerRepository,
                                                       MetadataResolverRepository resolverRepository) {

        return new DefaultMetadataResolversPositionOrderContainerService(positionOrderContainerRepository, resolverRepository);

    }
}
