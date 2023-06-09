package edu.internet2.tier.shibboleth.admin.ui.configuration

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlChainingMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.CustomEntityAttributeDefinitionRepository
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.security.DefaultAuditorAware
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository
import edu.internet2.tier.shibboleth.admin.ui.security.service.GroupServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.service.CustomEntityAttributesDefinitionServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.service.IndexWriterService
import net.shibboleth.ext.spring.resource.ResourceHelper
import net.shibboleth.utilities.java.support.component.ComponentInitializationException
import org.apache.lucene.document.Document
import org.apache.lucene.document.Field
import org.apache.lucene.document.StringField
import org.apache.lucene.document.TextField
import org.apache.lucene.index.IndexWriter
import org.opensaml.saml.metadata.resolver.ChainingMetadataResolver
import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.opensaml.saml.metadata.resolver.impl.ResourceBackedMetadataResolver
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ClassPathResource
import org.springframework.data.domain.AuditorAware
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.JavaMailSenderImpl

import javax.persistence.EntityManager

/**
 * NOT A TEST - this is configuration FOR tests
 */
@Configuration
class TestConfiguration {
    @Autowired
    IndexWriterService indexWriterService

    final OpenSamlObjects openSamlObjects
    final MetadataResolverRepository metadataResolverRepository
    final Logger logger = LoggerFactory.getLogger(TestConfiguration.class)

    @Autowired
    private CustomEntityAttributeDefinitionRepository repository;
            
    @Autowired
    EntityManager entityManager
    
    TestConfiguration(final OpenSamlObjects openSamlObjects, final MetadataResolverRepository metadataResolverRepository) {
        this.openSamlObjects =openSamlObjects
        this.metadataResolverRepository = metadataResolverRepository
    }

    @Bean
    RestTemplateBuilder restTemplateBuilder() {
        RestTemplateBuilder result = new RestTemplateBuilder()
        return result;
    }


    @Bean
    CustomEntityAttributesDefinitionServiceImpl customEntityAttributesDefinitionServiceImpl() {
        new CustomEntityAttributesDefinitionServiceImpl().with {
           it.repository = repository
           return it
        }
    }
    
    @Bean
    JavaMailSender javaMailSender() {
        return new JavaMailSenderImpl().with {
            it.host = 'localhost'
            it.port = 1025
            it
        }
    }

    @Bean
    MetadataResolver metadataResolver() {
        ChainingMetadataResolver metadataResolver = new OpenSamlChainingMetadataResolver()
        metadataResolver.setId("chain")
        String resolverId = "test"

        IndexWriter indexWriter = indexWriterService.getIndexWriter(resolverId)

        def shortIncommon = new ResourceBackedMetadataResolver(ResourceHelper.of(new ClassPathResource('/metadata/incommon-short.xml'))){
            @Override
            protected void initMetadataResolver() throws ComponentInitializationException {
                super.initMetadataResolver()

                for (String entityId: this.getBackingStore().getIndexedDescriptors().keySet()) {
                    Document document = new Document();
                    document.add(new StringField("id", entityId, Field.Store.YES))
                    document.add(new TextField("content", entityId, Field.Store.YES)) // TODO: change entityId to be content of entity descriptor block
                    try {
                        indexWriter.addDocument(document)
                    } catch (IOException e) {
                        logger.error(e.getMessage(), e)
                    }
                }
                try {
                    indexWriter.commit()
                } catch (IOException e) {
                    throw new ComponentInitializationException(e)
                }
            }
        }.with {
            it.id = resolverId
            TestConfiguration p = owner
            it.parserPool = p.openSamlObjects.parserPool
            it.initialize()
            it
        }

        metadataResolver.resolvers = [shortIncommon]
        metadataResolver.initialize()
        return metadataResolver
    }

    @Bean
    AuditorAware<String> defaultAuditorAware() {
        return new DefaultAuditorAware()
    }
    
    @Bean
    GroupServiceImpl groupServiceImpl(GroupsRepository repo, OwnershipRepository ownershipRepository) {
        new GroupServiceImpl().with {
            it.groupRepository = repo
            it.ownershipRepository = ownershipRepository
            return it
        }
    }
}