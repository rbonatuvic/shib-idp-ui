package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;
import org.opensaml.core.xml.XMLObject;
import org.opensaml.saml.ext.saml2mdui.Description;
import org.opensaml.saml.ext.saml2mdui.DisplayName;
import org.opensaml.saml.ext.saml2mdui.InformationURL;
import org.opensaml.saml.ext.saml2mdui.Keywords;
import org.opensaml.saml.ext.saml2mdui.Logo;
import org.opensaml.saml.ext.saml2mdui.PrivacyStatementURL;

import javax.annotation.Nullable;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.xml.namespace.QName;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@EqualsAndHashCode(callSuper = true)
public class UIInfo extends AbstractXMLObject implements org.opensaml.saml.ext.saml2mdui.UIInfo {
    @OneToMany
    @Cascade(CascadeType.ALL)
    private List<AbstractXMLObject> xmlObjects = new ArrayList<>();

    @Override
    public List<DisplayName> getDisplayNames() {
        return (List<DisplayName>) (List<? extends DisplayName>) this.xmlObjects.stream().filter(p -> p instanceof DisplayName).map(p -> (DisplayName) p).collect(Collectors.toList());
    }

    public void addDisplayName(edu.internet2.tier.shibboleth.admin.ui.domain.DisplayName displayName) {
        this.xmlObjects.add(displayName);
    }

    @Override
    public List<Keywords> getKeywords() {
        return this.xmlObjects.stream().filter(p -> p instanceof Keywords).map(p -> (Keywords) p).collect(Collectors.toList());
    }

    public void addKeywords(edu.internet2.tier.shibboleth.admin.ui.domain.Keywords keywords) {
        this.xmlObjects.add(keywords);
    }

    @Override
    public List<Description> getDescriptions() {
        return this.xmlObjects.stream().filter(p -> p instanceof Description).map(p -> (Description) p).collect(Collectors.toList());
    }

    public void addDescription(edu.internet2.tier.shibboleth.admin.ui.domain.Description description) {
        this.xmlObjects.add(description);
    }

    @Override
    public List<Logo> getLogos() {
        return this.xmlObjects.stream().filter(p -> p instanceof Logo).map(p -> (Logo) p).collect(Collectors.toList());
    }

    public void addLog(edu.internet2.tier.shibboleth.admin.ui.domain.Logo logo) {
        this.xmlObjects.add(logo);
    }

    @Override
    public List<InformationURL> getInformationURLs() {
        return this.xmlObjects.stream().filter(p -> p instanceof InformationURL).map(p -> (InformationURL) p).collect(Collectors.toList());
    }

    public void addInformationURL(edu.internet2.tier.shibboleth.admin.ui.domain.InformationURL informationURL) {
        this.xmlObjects.add(informationURL);
    }

    @Override
    public List<PrivacyStatementURL> getPrivacyStatementURLs() {
        return this.xmlObjects.stream().filter(p -> p instanceof PrivacyStatementURL).map(p -> (PrivacyStatementURL) p).collect(Collectors.toList());
    }

    public void addPrivacyStatementURL(edu.internet2.tier.shibboleth.admin.ui.domain.PrivacyStatementURL privacyStatementURL) {
        this.xmlObjects.add(privacyStatementURL);
    }

    @Override
    public List<XMLObject> getXMLObjects() {
        return (List<XMLObject>) (List<? extends XMLObject>) this.xmlObjects;
    }

    @Override
    public List<XMLObject> getXMLObjects(QName typeOrName) {
        return ((List<XMLObject>) (List<? extends XMLObject>) this.xmlObjects).stream().filter(p -> p.getSchemaType().equals(typeOrName) || p.getElementQName().equals(typeOrName)).collect(Collectors.toList());
    }

    @Nullable
    @Override
    public List<XMLObject> getOrderedChildren() {
        List<XMLObject> children = new ArrayList<>();

        children.addAll(this.getXMLObjects());

        return children;
    }
}
