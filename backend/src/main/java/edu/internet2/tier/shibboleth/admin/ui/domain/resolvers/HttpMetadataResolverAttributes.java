package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
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
@EqualsAndHashCode
public class HttpMetadataResolverAttributes {

    private String httpClientRef;

    private String connectionRequestTimeout;

    private String connectionTimeout;

    private String socketTimeout;

    private Boolean disregardTLSCertificate = false;

    private String tlsTrustEngineRef;

    private String httpClientSecurityParametersRef;

    private String proxyHost;

    private String proxyPort;

    private String proxyUser;

    private String proxyPassword;

    @Enumerated(STRING)
    @Column(length = 6)
    private HttpCachingType httpCaching;

    private String httpCacheDirectory;

    private Integer httpMaxCacheEntries;

    private Integer httpMaxCacheEntrySize;

    public enum HttpCachingType {
        none,file,memory
    }
}
