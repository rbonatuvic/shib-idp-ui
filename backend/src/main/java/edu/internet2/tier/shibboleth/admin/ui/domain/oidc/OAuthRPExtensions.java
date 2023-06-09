package edu.internet2.tier.shibboleth.admin.ui.domain.oidc;

import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractXMLObject;
import edu.internet2.tier.shibboleth.admin.ui.domain.Audience;
import lombok.Data;
import net.shibboleth.oidc.saml.xmlobject.MetadataValueSAMLObject;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.hibernate.envers.Audited;
import org.opensaml.core.xml.XMLObject;
import org.opensaml.core.xml.util.AttributeMap;

import javax.annotation.Nonnull;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Transient;
import javax.xml.namespace.QName;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Entity
@Data
@Audited
public class OAuthRPExtensions extends AbstractXMLObject implements net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions {
    public static final String DEFAULT_ELEMENT_LOCAL_NAME = TYPE_LOCAL_NAME;
    private static final Collection<String> equalsAndHashExcludeList = Arrays.asList(new String[] {"unknownXMLObjects", "requestUris", "postLogoutRedirectUris", "defaultAcrValues", "audiences", "unknownAttributes"});

    // Only support the attributes used by Shib 4.x - https://shibboleth.atlassian.net/wiki/spaces/SC/pages/1912406916/OAuthRPMetadataProfile
    @Transient
    private final AttributeMap unknownAttributes = new AttributeMap(this);

    private String applicationType;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Audience> audiences = new ArrayList<>();

    private String clientUri;

    @OneToMany(cascade = CascadeType.ALL)
    private List<DefaultAcrValue> defaultAcrValues = new ArrayList<>();

    private int defaultMaxAge;

    private String grantTypes;

    private String idTokenEncryptedResponseAlg;

    private String idTokenEncryptedResponseEnc;

    private String idTokenSignedResponseAlg;

    private String initiateLoginUri;

    @OneToMany(cascade = CascadeType.ALL)
    private List<PostLogoutRedirectUri> postLogoutRedirectUris = new ArrayList<>();

    private String requestObjectEncryptionAlg;

    private String requestObjectEncryptionEnc;

    private String requestObjectSigningAlg;

    @OneToMany(cascade = CascadeType.ALL)
    private List<RequestUri> requestUris = new ArrayList<>();

    private boolean requireAuthTime;

    private String responseTypes;

    private String scopes;

    private String sectorIdentifierUri;

    private String softwareId;

    private String softwareVersion;

    private String tokenEndpointAuthMethod;

    private String tokenEndpointAuthSigningAlg;

    @OneToMany(cascade = CascadeType.ALL)
    List<AbstractXMLObject> unknownXMLObjects = new ArrayList<>();

    private String userInfoSignedResponseAlg;

    private String userInfoEncryptedResponseAlg;

    private String userInfoEncryptedResponseEnc;

    public OAuthRPExtensions() {
        setNamespacePrefix(MetadataValueSAMLObject.SAML20MDOIDCMD_PREFIX);
        setNamespaceURI(MetadataValueSAMLObject.SAML20MDOIDCMD_NS);
        setElementLocalName(TYPE_LOCAL_NAME);
    }

    @Override
    public List<XMLObject> getOrderedChildren() {
        List<XMLObject> result = new ArrayList<>();
        result.addAll(defaultAcrValues);
        result.addAll(requestUris);
        result.addAll(postLogoutRedirectUris);
        result.addAll(audiences);
        result.addAll(unknownXMLObjects);
        return result;
    }

    @Override
    public List<XMLObject> getUnknownXMLObjects() {
        return this.unknownXMLObjects.stream().filter(p -> true).collect(Collectors.toList());
    }

    @Nonnull
    @Override
    public List<XMLObject> getUnknownXMLObjects(@Nonnull QName typeOrName) {
        return this.unknownXMLObjects.stream().filter(p -> p.getElementQName().equals(typeOrName) || p.getSchemaType().equals(typeOrName)).collect(Collectors.toList());
    }

    @Override
    public List<net.shibboleth.oidc.saml.xmlobject.PostLogoutRedirectUri> getPostLogoutRedirectUris() {
        List<net.shibboleth.oidc.saml.xmlobject.PostLogoutRedirectUri> result = new ArrayList<>();
        result.addAll(postLogoutRedirectUris);
        return result;
    }

    @Override
    public List<net.shibboleth.oidc.saml.xmlobject.DefaultAcrValue> getDefaultAcrValues() {
        List<net.shibboleth.oidc.saml.xmlobject.DefaultAcrValue> result = new ArrayList<>();
        result.addAll(defaultAcrValues);
        return result;
    }

    @Override
    public List<net.shibboleth.oidc.saml.xmlobject.RequestUri> getRequestUris() {
        List<net.shibboleth.oidc.saml.xmlobject.RequestUri> result = new ArrayList<>();
        result.addAll(requestUris);
        return result;
    }

    public void addAudience(Audience aud) {
        this.audiences.add(aud);
    }

    public void addDefaultAcrValue(DefaultAcrValue childSAMLObject) {
        defaultAcrValues.add(childSAMLObject);
    }

    public void addRequestUri(RequestUri childSAMLObject) {
        requestUris.add(childSAMLObject);
    }

    public void addPostLogoutRedirectUri(PostLogoutRedirectUri childSAMLObject) {
        postLogoutRedirectUris.add(childSAMLObject);
    }

    @Override
    public int hashCode() {
        AtomicInteger retVal = new AtomicInteger(HashCodeBuilder.reflectionHashCode(this, equalsAndHashExcludeList));
        getUnknownXMLObjects().forEach(xmlObject -> retVal.addAndGet(xmlObject.hashCode()));
        return retVal.get();
    }

    @Override
    public boolean equals(Object o) {
        boolean retVal = o instanceof OAuthRPExtensions;
        if (retVal) {
            retVal = EqualsBuilder.reflectionEquals(this, o, equalsAndHashExcludeList);
            if (retVal){
                List<XMLObject> oChildren = ((OAuthRPExtensions) o).getOrderedChildren();
                List<XMLObject> thisChildren = getOrderedChildren();
                retVal = thisChildren.size() == oChildren.size() && thisChildren.containsAll(oChildren);
            }
        }
        return retVal;
    }
}