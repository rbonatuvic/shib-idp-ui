package edu.internet2.tier.shibboleth.admin.ui.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.internet2.tier.shibboleth.admin.ui.domain.oidc.DynamicRegistrationInfo;
import edu.internet2.tier.shibboleth.admin.ui.exception.UnsupportedShibUiOperationException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

/**
 * Requires that the shib server url be non-null
 */
public class ShibRestTemplateDelegate {
    private URL shibUrl;
    private RestTemplate restTemplate;

    public ShibRestTemplateDelegate(URL url, RestTemplate template) {
        this.restTemplate = template;
        if (url != null) {
            try {
                shibUrl = new URL(url.toExternalForm() + "/profile/oidc/register");
            }
            catch (MalformedURLException e) {
                shibUrl = null;
            }
        }
    }

    public HttpStatus sendRequest(DynamicRegistrationInfo dri) throws UnsupportedShibUiOperationException {
        if (shibUrl == null) {
            throw new UnsupportedShibUiOperationException("Dynamic Registration endpoint not configured properly, please contact your system admin.");
        }
        try {
            ResponseEntity response = restTemplate.postForEntity(shibUrl.toURI(), convertDynamicReg(dri), Map.class);
            return response.getStatusCode();
        }
        catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
    }

    private Object convertDynamicReg(DynamicRegistrationInfo dri) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        ObjectMapper mapper = new ObjectMapper();
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL); // skip any null values

        Map<String, String> valuesMap = new HashMap<>();
        valuesMap.put("redirect_uris", dri.getRedirectUris());
        valuesMap.put("response_types", dri.getResponseTypes());
        valuesMap.put("grant_types", dri.getGrantType().name());
        valuesMap.put("application_type", dri.getApplicationType());
        valuesMap.put("contacts", dri.getContacts());
        valuesMap.put("subject_type", dri.getSubjectType());
        valuesMap.put("jwks", dri.getJwks());
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
}