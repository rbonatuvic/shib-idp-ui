package edu.internet2.tier.shibboleth.admin.ui.domain;

import com.google.common.collect.Lists;
import lombok.EqualsAndHashCode;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import java.util.List;


@Entity
@EqualsAndHashCode(callSuper = true)
public class AffiliationDescriptor extends AbstractDescriptor implements org.opensaml.saml.saml2.metadata.AffiliationDescriptor {

    private String ownerId;
    private String localId;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "affildesc_affilmemb_id")
    private List<AffiliateMember> affiliateMembers;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "affildesc_keydesc_id")
    private List<KeyDescriptor> keyDescriptors;

    @Override
    public String getID() {
        return localId;
    }

    @Override
    public void setID(String id) {
        this.localId = id;
    }

    @Override
    public String getOwnerID() {
        return ownerId;
    }

    @Override
    public void setOwnerID(String ownerId) {
        this.ownerId = ownerId;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.AffiliateMember> getMembers() {
        return Lists.newArrayList(affiliateMembers);
    }

    public void setAffiliateMembers(List<AffiliateMember> affiliateMembers) {
        this.affiliateMembers = affiliateMembers;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.KeyDescriptor> getKeyDescriptors() {
        return Lists.newArrayList(keyDescriptors);
    }

    public void setKeyDescriptors(List<KeyDescriptor> keyDescriptors) {
        this.keyDescriptors = keyDescriptors;
    }
}
