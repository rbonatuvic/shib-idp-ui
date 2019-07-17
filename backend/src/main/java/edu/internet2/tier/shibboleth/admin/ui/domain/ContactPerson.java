package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;
import org.opensaml.core.xml.XMLObject;
import org.opensaml.saml.saml2.metadata.ContactPersonTypeEnumeration;

import javax.annotation.Nullable;
import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;


@Entity
@EqualsAndHashCode(callSuper = true)
@Audited
public class ContactPerson extends AbstractAttributeExtensibleXMLObject implements org.opensaml.saml.saml2.metadata.ContactPerson {

    private String contactPersonType;

    @OneToOne(cascade = CascadeType.ALL)
    @NotAudited
    private Extensions extensions;

    @OneToOne(cascade = CascadeType.ALL)
    @NotAudited
    private Company company;

    @OneToOne(cascade = CascadeType.ALL)
    private GivenName givenName;

    @OneToOne(cascade = CascadeType.ALL)
    @NotAudited
    private SurName surName;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "contactpersn_emailaddr_id")
    @OrderColumn
    private List<EmailAddress> emailAddresses = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "contactpersn_telenmbr_id")
    @OrderColumn
    @NotAudited
    private List<TelephoneNumber> telephoneNumbers = new ArrayList<>();

    @Override
    @Transient
    public org.opensaml.saml.saml2.metadata.ContactPersonTypeEnumeration getType() {
        if(this.contactPersonType != null) {
            try {
                return (ContactPersonTypeEnumeration)
                        ContactPersonTypeEnumeration.class.getField(this.contactPersonType.toUpperCase()).get(null);
            }
            catch (NoSuchFieldException | IllegalAccessException e) {
                return null;
            }
        }
        return null;
    }

    @Override
    public void setType(org.opensaml.saml.saml2.metadata.ContactPersonTypeEnumeration contactPersonTypeEnumeration) {
        this.contactPersonType = contactPersonTypeEnumeration.toString();
    }

    public void setType(String type) {
        this.contactPersonType = type;
    }

    @Override
    public Extensions getExtensions() {
        return extensions;
    }

    @Override
    public void setExtensions(org.opensaml.saml.saml2.metadata.Extensions extensions) {
        this.extensions = (Extensions) extensions;
    }

    @Override
    public Company getCompany() {
        return company;
    }

    @Override
    public void setCompany(org.opensaml.saml.saml2.metadata.Company company) {
        this.company = (Company) company;
    }

    @Override
    public GivenName getGivenName() {
        return givenName;
    }

    @Override
    public void setGivenName(org.opensaml.saml.saml2.metadata.GivenName givenName) {
        this.givenName = (GivenName) givenName;
    }

    @Override
    public SurName getSurName() {
        return surName;
    }

    @Override
    public void setSurName(org.opensaml.saml.saml2.metadata.SurName surName) {
        this.surName = (SurName) surName;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.EmailAddress> getEmailAddresses() {
        return (List<org.opensaml.saml.saml2.metadata.EmailAddress>) (List<? extends org.opensaml.saml.saml2.metadata.EmailAddress>) this.emailAddresses;
    }

    public void setEmailAddresses(List<EmailAddress> emailAddresses) {
        this.emailAddresses = emailAddresses;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.TelephoneNumber> getTelephoneNumbers() {
        return (List<org.opensaml.saml.saml2.metadata.TelephoneNumber>) (List<? extends org.opensaml.saml.saml2.metadata.TelephoneNumber>) this.telephoneNumbers;
    }

    public void setTelephoneNumbers(List<TelephoneNumber> telephoneNumbers) {
        this.telephoneNumbers = telephoneNumbers;
    }

    public void addEmailAddress(EmailAddress emailAddress) {
        this.emailAddresses.add(emailAddress);
    }

    @Nullable
    @Override
    public List<XMLObject> getOrderedChildren() {
        List<XMLObject> list = new ArrayList<>();

        list.add(this.extensions);
        list.add(this.company);
        list.add(this.givenName);
        list.add(this.surName);
        list.addAll(this.emailAddresses);
        list.addAll(this.telephoneNumbers);

        if (list.size() == 0) {
            return null;
        }

        return list;
    }
}
