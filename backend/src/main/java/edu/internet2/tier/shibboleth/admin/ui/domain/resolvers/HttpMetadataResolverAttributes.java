package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Enumerated;

import static javax.persistence.EnumType.STRING;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class HttpMetadataResolverAttributes {

    private String httpClientRef;

    private String connectionRequestTimeout;

    private String requestTimeout;

    private String socketTimeout;

    private Boolean disregardTLSCertificate;

    private String tlsTrustEngineRef;

    private String httpClientSecurityParametersRef;

    private String proxyHost;

    private String proxyPort;

    private String proxyUser;

    private String proxyPassword;

    @Enumerated(STRING)
    @Column(length = 5)
    private HttpCachingType httpCaching;

    private String httpCacheDirectory;

    private Integer httpMaxCacheEntries;

    private Integer httpMaxCacheEntrySize;

    private enum HttpCachingType {
        none,file,memory
    }
}
