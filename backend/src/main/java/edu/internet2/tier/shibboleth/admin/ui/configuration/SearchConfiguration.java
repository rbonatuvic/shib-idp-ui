package edu.internet2.tier.shibboleth.admin.ui.configuration;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.LowerCaseFilter;
import org.apache.lucene.analysis.StopFilter;
import org.apache.lucene.analysis.TokenFilter;
import org.apache.lucene.analysis.ngram.NGramTokenFilter;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.analysis.standard.StandardTokenizer;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.RAMDirectory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
public class SearchConfiguration {
    @Bean
    Directory directory() {
        return new RAMDirectory();
    }

    @Bean
    Analyzer analyzer() {
        return new Analyzer() {
            @Override
            protected TokenStreamComponents createComponents(String fieldName) {
                final StandardTokenizer src = new StandardTokenizer();
                src.setMaxTokenLength(255);
                TokenFilter tokenFilter;
                tokenFilter = new NGramTokenFilter(src, 3, 10);
                tokenFilter = new LowerCaseFilter(tokenFilter);
                tokenFilter = new StopFilter(tokenFilter, StandardAnalyzer.STOP_WORDS_SET);
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
                tokenFilter = new StopFilter(tokenFilter, StandardAnalyzer.STOP_WORDS_SET);
                return new TokenStreamComponents(src, tokenFilter);
            }
        };
    }

    @Bean
    IndexWriter indexWriter() throws IOException {
        IndexWriterConfig indexWriterConfig = new IndexWriterConfig(analyzer());
        indexWriterConfig.setOpenMode(IndexWriterConfig.OpenMode.CREATE_OR_APPEND);
        return new IndexWriter(directory(), indexWriterConfig);
    }
}
