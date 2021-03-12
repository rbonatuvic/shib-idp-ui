package edu.internet2.tier.shibboleth.admin.ui.configuration;

import edu.internet2.tier.shibboleth.admin.ui.service.DirectoryService;
import edu.internet2.tier.shibboleth.admin.ui.service.IndexWriterService;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.LowerCaseFilter;
import org.apache.lucene.analysis.StopFilter;
import org.apache.lucene.analysis.TokenFilter;
import org.apache.lucene.analysis.en.EnglishAnalyzer;
import org.apache.lucene.analysis.ngram.NGramTokenFilter;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.analysis.standard.StandardTokenizer;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.store.Directory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class SearchConfiguration {
    @Autowired
    DirectoryService directoryService;

    @Bean
    Analyzer analyzer() {
        return new Analyzer() {
            @Override
            protected TokenStreamComponents createComponents(String fieldName) {
                final StandardTokenizer src = new StandardTokenizer();
                src.setMaxTokenLength(255);
                TokenFilter tokenFilter;
                tokenFilter = new NGramTokenFilter(src, 3, 10, true);
                tokenFilter = new LowerCaseFilter(tokenFilter);
                tokenFilter = new StopFilter(tokenFilter, EnglishAnalyzer.ENGLISH_STOP_WORDS_SET);
                return new TokenStreamComponents(src, tokenFilter);
            }
        };
    }

    @Bean
    Analyzer fullTokenAnalyzer() {
        return new Analyzer() {
            @Override
            protected TokenStreamComponents createComponents(String fieldName) {
                final StandardTokenizer src = new StandardTokenizer();
                src.setMaxTokenLength(255);
                TokenFilter tokenFilter;
                tokenFilter = new LowerCaseFilter(src);
                tokenFilter = new StopFilter(tokenFilter, EnglishAnalyzer.ENGLISH_STOP_WORDS_SET);
                return new TokenStreamComponents(src, tokenFilter);
            }
        };
    }

    private IndexWriter createIndexWriter(Directory directory) throws IOException {
        IndexWriterConfig indexWriterConfig = new IndexWriterConfig(analyzer());
        indexWriterConfig.setOpenMode(IndexWriterConfig.OpenMode.CREATE_OR_APPEND);
        return new IndexWriter(directory, indexWriterConfig);
    }

    @Bean
    public IndexWriterService indexWriterService() {
        Map<String, IndexWriter> indexWriterMap = new HashMap<>();

        return resourceId -> {
            IndexWriter indexWriter = indexWriterMap.get(resourceId);
            if (indexWriter == null) {
                indexWriter = createIndexWriter(directoryService.getDirectory(resourceId));
                indexWriter.commit();
                indexWriterMap.put(resourceId, indexWriter);
            }
            return indexWriter;
        };
    }
}
