package edu.internet2.tier.shibboleth.admin.ui.domain.oidc;

import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import edu.internet2.tier.shibboleth.admin.ui.domain.ActivatableType;
import edu.internet2.tier.shibboleth.admin.ui.domain.IActivatable;
import edu.internet2.tier.shibboleth.admin.ui.domain.IApprovable;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownable;
import edu.internet2.tier.shibboleth.admin.ui.security.model.OwnableType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Type;
import org.hibernate.envers.Audited;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Lob;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Audited
public class DynamicRegistrationInfo extends AbstractAuditable implements Ownable, IActivatable, IApprovable {
    private String applicationType;
    private boolean approved;
    private String contacts;
    private boolean enabled;
    private GrantType grantType;
    private String idOfOwner;
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    private String jwks;
    private String logoUri;
    private String name;
    private String policyUri;
    private String redirectUris;
    private String resourceId;
    private String responseTypes;
    private String scope;
    private String subjectType;
    private String tokenEndpointAuthMethod;
    private String tosUri;
    private String clientId;

    @ElementCollection(fetch = FetchType.EAGER)
    @EqualsAndHashCode.Exclude
    private List<String> approvedBy = new ArrayList<>();

    @Override
    public ActivatableType getActivatableType() {
        return ActivatableType.DYNAMIC_REGISTRATION;
    }

    @Override
    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    @Override
    public String getObjectId() {
        return getResourceId();
    }

    public String getResourceId() {
        if (resourceId == null) {
            resourceId = UUID.randomUUID().toString();
        }
        return resourceId;
    }

    @Override
    public OwnableType getOwnableType() {
        return OwnableType.DYNAMIC_REGISTRATION;
    }

    @Override
    public void removeLastApproval() {
        if (!approvedBy.isEmpty()) {
            approvedBy.remove(approvedBy.size() - 1);
        }
    }

    public int approvedCount() {
        return approvedBy.size();
    }

    public void addApproval(Group currentUserGroup) {
        approvedBy.add(currentUserGroup.getName());
    }
}