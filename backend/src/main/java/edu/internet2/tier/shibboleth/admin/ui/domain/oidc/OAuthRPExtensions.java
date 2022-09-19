package edu.internet2.tier.shibboleth.admin.ui.domain.oidc;

import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractXMLObject;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.envers.Audited;
import org.opensaml.core.xml.XMLObject;
import org.opensaml.core.xml.util.AttributeMap;

import javax.annotation.Nonnull;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import javax.persistence.Transient;
import javax.xml.namespace.QName;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Data
@NoArgsConstructor
@Audited
public class OAuthRPExtensions extends AbstractXMLObject implements net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions {
    @Transient
    private final AttributeMap unknownAttributes = new AttributeMap(this);

    private String applicationType;

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
    @OrderColumn
    List<AbstractXMLObject> unknownXMLObjects = new ArrayList<>();

    private String userInfoSignedResponseAlg;

    private String userInfoEncryptedResponseAlg;

    private String userInfoEncryptedResponseEnc;

    @Nonnull
    @Override
    public List<XMLObject> getUnknownXMLObjects(@Nonnull QName typeOrName) {
        return this.unknownXMLObjects.stream().filter(p -> p.getElementQName().equals(typeOrName) || p.getSchemaType().equals(typeOrName)).collect(Collectors.toList());
    }
}