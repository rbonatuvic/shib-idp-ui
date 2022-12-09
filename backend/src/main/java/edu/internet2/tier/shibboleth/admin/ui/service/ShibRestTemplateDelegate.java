package edu.internet2.tier.shibboleth.admin.ui.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.internet2.tier.shibboleth.admin.ui.configuration.ShibUIConfiguration;
import edu.internet2.tier.shibboleth.admin.ui.domain.oidc.DynamicRegistrationInfo;
import edu.internet2.tier.shibboleth.admin.ui.exception.UnsupportedShibUiOperationException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * Requires that the shib server url be non-null. The URL of the shib idp server ala - https://idp.someschool.edu/idp
 * The URL is used to both fetch a token from Shib as well as to call the OIDC plugin
 */
public class ShibRestTemplateDelegate {
    ShibUIConfiguration config;
    private URL tokenURL;
    private URL registrationURL;
    private RestTemplate restTemplate;

    public ShibRestTemplateDelegate(ShibUIConfiguration config) {
        this.config = config;
        URL url = config.getShibIdpServer();
        if (url != null) {
            try {
                registrationURL = new URL(url.toExternalForm() + "/profile/oidc/register");
                tokenURL = new URL(url.toExternalForm() + "/profile/admin/oidc/issue-registration-access-token?policyId=shibboleth.DefaultRelyingParty");
            }
            catch (MalformedURLException e) {
                tokenURL = null;
                registrationURL = null;
            }
        }
    }

    /**
     * Handles sending the Dynamic Registration request to Shibboleth (assuming the URL for Shib was configured for this)
     * @throws UnsupportedShibUiOperationException
     */
    public HttpStatus sendRequest(DynamicRegistrationInfo dri) throws UnsupportedShibUiOperationException {
        if (config.getRestTemplate() != null) {
            this.restTemplate = config.getRestTemplate();
        }

        if (tokenURL == null) {
            throw new UnsupportedShibUiOperationException("Dynamic Registration endpoint not configured properly, please contact your system admin.");
        }
        try {
            // Fetch an access token from SHIBBOLETH
            ResponseEntity tokenResponse = restTemplate.postForEntity(tokenURL.toURI(), "", Map.class);
            String token = ((Map)tokenResponse.getBody()).get("access_token").toString();

            HttpEntity<String> entity = convertDynamicReg(dri, token);
            ResponseEntity response = restTemplate.exchange(registrationURL.toURI(), HttpMethod.POST, entity, Map.class);
            if (response.getStatusCode() == HttpStatus.CREATED) {
                dri.setClientId(((Map)response.getBody()).get("client_id").toString());
            }
            return response.getStatusCode();
        }
        catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
    }

    private HttpEntity<String> convertDynamicReg(DynamicRegistrationInfo dri, String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + token);
        ObjectMapper mapper = new ObjectMapper();
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL); // skip any null values

        Map<String, Object> valuesMap = new HashMap<>();
        valuesMap.put("redirect_uris", arrayOrNull(dri.getRedirectUris()));
        valuesMap.put("response_types", arrayOrNull(dri.getResponseTypes()));
        valuesMap.put("grant_types", dri.getGrantType());
        valuesMap.put("application_type", dri.getApplicationType());
        valuesMap.put("contacts", arrayOrNull(dri.getContacts()));
        valuesMap.put("subject_type", dri.getSubjectType());
        valuesMap.put("jwks", StringUtils.defaultIfEmpty(dri.getJwks(), null));
        valuesMap.put("token_endpoint_auth_method", dri.getTokenEndpointAuthMethod());
        valuesMap.put("logo_uri", dri.getLogoUri());
        valuesMap.put("policy_uri", dri.getPolicyUri());
        valuesMap.put("tos_uri", dri.getTosUri());
        valuesMap.put("scope", dri.getScope());

        String json;
        try {
            json = mapper.writeValueAsString(valuesMap);
        }
        catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return new HttpEntity<String>(json, headers);
    }

    private String[] arrayOrNull(String values) {
        if (values == null) {
            return null;
        }
        return values.split(" ");
    }
}