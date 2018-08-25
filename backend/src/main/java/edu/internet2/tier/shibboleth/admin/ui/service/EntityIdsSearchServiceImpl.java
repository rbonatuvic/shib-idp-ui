package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityIdsSearchResultRepresentation;
import edu.internet2.tier.shibboleth.admin.util.LuceneUtility;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopDocs;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class EntityIdsSearchServiceImpl implements EntityIdsSearchService {
    private static final Logger logger = LoggerFactory.getLogger(EntityIdsSearchServiceImpl.class);
    private Analyzer fullTokenAnalyzer;
    private LuceneUtility luceneUtility;

    public EntityIdsSearchServiceImpl(LuceneUtility luceneUtility, Analyzer fullTokenAnalyzer) {
        this.luceneUtility = luceneUtility;
        this.fullTokenAnalyzer = fullTokenAnalyzer;
    }

    @Override
    public EntityIdsSearchResultRepresentation findBySearchTermAndOptionalLimit(String resourceId,
                                                                                String searchTerm,
                                                                                int limit) {
        List<String> entityIds = new ArrayList<>();
        try {
            IndexReader indexReader = luceneUtility.getIndexReader(resourceId);
            IndexSearcher searcher = new IndexSearcher(indexReader);
            QueryParser parser = new QueryParser("content", fullTokenAnalyzer);
            TopDocs topDocs = searcher.search(parser.parse(searchTerm.trim()), limit);
            for (ScoreDoc scoreDoc : topDocs.scoreDocs) {
                Document document = searcher.doc(scoreDoc.doc);
                entityIds.add(document.get("id"));
            }
        } catch (IOException | ParseException e) {
            logger.error(e.getMessage(), e);
        }
        return new EntityIdsSearchResultRepresentation(entityIds);
    }
}
