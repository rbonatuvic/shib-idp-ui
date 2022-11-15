package edu.internet2.tier.shibboleth.admin.ui.domain.frontend;

import edu.internet2.tier.shibboleth.admin.ui.domain.oidc.DynamicRegistrationInfo;
import edu.internet2.tier.shibboleth.admin.ui.domain.oidc.GrantType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@NoArgsConstructor
@Getter
@Setter
public class DynamicRegistrationRepresentation {
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSSSS");

    private String applicationType;
    private boolean approved;
    private String contacts;
    private LocalDateTime createdDate;
    private boolean enabled;
    private GrantType grantType;
    private String idOfOwner;
    private String jwks;
    private String logoUri;
    private String name;
    private LocalDateTime modifiedDate;
    private String policyUri;
    private String redirectUris;
    private String resourceId;
    private String responseTypes;
    private String scope;
    private String subjectType;
    private String tokenEndpointAuthMethod;
    private String tosUri;
    private int version;

    public DynamicRegistrationRepresentation(DynamicRegistrationInfo dri) {
        applicationType = dri.getApplicationType();
        approved = dri.isApproved();
        contacts = dri.getContacts();
        createdDate = dri.getCreatedDate();
        enabled = dri.isEnabled();
        grantType = dri.getGrantType();
        idOfOwner = dri.getIdOfOwner();
        jwks = dri.getJwks();
        logoUri = dri.getLogoUri();
        name = dri.getName();
        modifiedDate = dri.getModifiedDate();
        policyUri = dri.getPolicyUri();
        redirectUris = dri.getRedirectUris();
        resourceId = dri.getResourceId();
        responseTypes = dri.getResponseTypes();
        scope = dri.getScope();
        subjectType = dri.getSubjectType();
        tokenEndpointAuthMethod = dri.getTokenEndpointAuthMethod();
        tosUri = dri.getTosUri();
        version = dri.hashCode();
    }

    public DynamicRegistrationInfo buildDynamicRegistrationInfo() {
        // Approved and enabled shouldn't be handled from here, and owner shouldn't come from the UI, so we ignore all those

        DynamicRegistrationInfo dri = new DynamicRegistrationInfo();
        dri.setApplicationType(applicationType);
//        dri.setApproved(approved);
        dri.setContacts(contacts);
//        dri.setEnabled(enabled);
        dri.setGrantType(grantType);
//        dri.setIdOfOwner(idOfOwner);
        dri.setJwks(jwks);
        dri.setLogoUri(logoUri);
        dri.setName(name);
        dri.setPolicyUri(policyUri);
        dri.setRedirectUris(redirectUris);
        dri.setResourceId(resourceId);
        dri.setResponseTypes(responseTypes);
        dri.setScope(scope);
        dri.setSubjectType(subjectType);
        dri.setTokenEndpointAuthMethod(tokenEndpointAuthMethod);
        dri.setTosUri(tosUri);
        return dri;
    }

    public String getCreatedDate() {
        return createdDate != null ? DATE_TIME_FORMATTER.format(createdDate) : null;
    }

    public String getModifiedDate() {
        return modifiedDate != null ? DATE_TIME_FORMATTER.format(modifiedDate) : null;
    }

    /**
     * Do not update approved or change the group here
     */
    public DynamicRegistrationInfo updateExistingWithRepValues(DynamicRegistrationInfo dri) {
        dri.setApplicationType(applicationType);
        dri.setContacts(contacts);
        dri.setEnabled(enabled);
        dri.setGrantType(grantType);
        dri.setJwks(jwks);
        dri.setLogoUri(logoUri);
        dri.setName(name);
        dri.setPolicyUri(policyUri);
        dri.setRedirectUris(redirectUris);
        dri.setResourceId(resourceId);
        dri.setResponseTypes(responseTypes);
        dri.setScope(scope);
        dri.setSubjectType(subjectType);
        dri.setTokenEndpointAuthMethod(tokenEndpointAuthMethod);
        dri.setTosUri(tosUri);
        return dri;
    }
}