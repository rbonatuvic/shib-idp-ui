package edu.internet2.tier.shibboleth.admin.ui.configuration;

import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityIdsSearchResultRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository;
import edu.internet2.tier.shibboleth.admin.ui.scheduled.EntityDescriptorFilesScheduledTasks;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityIdsSearchService;
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityDescriptorServiceImpl;
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
    public EntityDescriptorService jpaEntityDescriptorService() {
        return new JPAEntityDescriptorServiceImpl(openSamlObjects());
    }

    @Autowired
    Analyzer fullTokenAnalyzer;

    @Autowired
    Directory directory;


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
                TopDocs topDocs = searcher.search(parser.parse(term), limit);
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
}
