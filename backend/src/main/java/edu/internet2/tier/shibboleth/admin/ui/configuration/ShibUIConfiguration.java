package edu.internet2.tier.shibboleth.admin.ui.configuration;

import lombok.Getter;
import lombok.Setter;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.Resource;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.KeyManager;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.net.URL;
import java.net.http.HttpClient;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.List;
import java.util.Set;

@Configuration
@ConfigurationProperties(prefix = "shibui")
@Getter
@Setter
public class ShibUIConfiguration {
    /**
     * A list of namespaces that should be excluded from incoming metadata. This is used to prevent third party metadata
     * sources from using attributes that they might not have the rights to use.
     */
    private List<String> protectedAttributeNamespaces;

    /**
     * A Resource containing a CSV of users to bootstrap into the system. Currently, this must be in format
     *
     * <code>
     * username,password,firstName,lastName,role,email
     * </code>
     *
     * Note that the password must be encrypted in the file. Ensure that you prepend the encoder to the value, e.g.
     *
     * <code>
     * {bcrypt}$2a$10$ssM2LpFqceRQ/ta0JehGcu0BawFQDbxjQGSyVmKS6qa09hHLigtAO
     * </code>
     */
    private Resource userBootstrapResource;

    /**
     * A list of roles to bootstrap into the system.
     */
    private Set<String> roles;

    /**
     * The URL of the shib idp server ala - https://idp.someschool.edu/idp
     */
    private URL shibIdpServer;

    private RestTemplate restTemplate;

    @Profile("very-dangerous")
    @Bean
    public RestTemplate dangerousRestTemplate() throws NoSuchAlgorithmException, KeyManagementException, KeyStoreException {
        HttpsURLConnection.setDefaultHostnameVerifier(new HostnameVerifier() {
            public boolean verify(String hostname, SSLSession session) {
                return true;
            }
        });

        TrustStrategy acceptingTrustStrategy = (x509Certificates, s) -> true;
        SSLContext sslContext = org.apache.http.ssl.SSLContexts.custom().loadTrustMaterial(null, acceptingTrustStrategy).build();
        SSLConnectionSocketFactory csf = new SSLConnectionSocketFactory(sslContext, new NoopHostnameVerifier());
        CloseableHttpClient httpClient = HttpClients.custom().setSSLSocketFactory(csf).build();
        HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
        requestFactory.setHttpClient(httpClient);
        restTemplate = new RestTemplate(requestFactory);
        return restTemplate;
    }
}