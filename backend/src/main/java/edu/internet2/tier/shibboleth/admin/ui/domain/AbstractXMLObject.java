package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import net.shibboleth.utilities.java.support.collection.LockableClassToInstanceMultiMap;
import net.shibboleth.utilities.java.support.xml.QNameSupport;
import org.opensaml.core.config.ConfigurationService;
import org.opensaml.core.xml.Namespace;
import org.opensaml.core.xml.NamespaceManager;
import org.opensaml.core.xml.XMLObject;
import org.opensaml.core.xml.config.XMLObjectProviderRegistry;
import org.opensaml.core.xml.io.MarshallingException;
import org.opensaml.core.xml.schema.XSBooleanValue;
import org.opensaml.core.xml.util.IDIndex;
import org.w3c.dom.Element;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Transient;
import javax.xml.namespace.QName;
import java.util.List;
import java.util.Set;


/**
 * This covers both SAMLObject and XMLObject
 */
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@EqualsAndHashCode(callSuper = true)
public abstract class AbstractXMLObject extends AbstractAuditable implements XMLObject {

    private String namespaceURI;
    private String elementLocalName;
    private String namespacePrefix;

    private String schemaTypeNamespaceURI;
    private String schemaTypeElementLocalName;
    private String schemaTypeNamespacePrefix;

    //TODO all this class

    public void detach() {

    }

    @Transient
    private transient Element dom;

    @Nullable
    public Element getDOM() {
        return this.dom;
    }

    public void setDom(Element dom) {
        this.dom = dom;
    }

    public String getNamespaceURI() {
        return namespaceURI;
    }

    public void setNamespaceURI(String namespaceURI) {
        this.namespaceURI = namespaceURI;
    }

    public String getElementLocalName() {
        return elementLocalName;
    }

    public void setElementLocalName(String elementLocalName) {
        this.elementLocalName = elementLocalName;
    }

    public String getNamespacePrefix() {
        return namespacePrefix;
    }

    public void setNamespacePrefix(String namespacePrefix) {
        this.namespacePrefix = namespacePrefix;
    }

    @Transient
    public QName getElementQName() {
        return QNameSupport.constructQName(this.getNamespaceURI(), this.getElementLocalName(), this.getNamespacePrefix());
    }

    @Nullable
    public IDIndex getIDIndex() {
        //Is this OK?
        //return new IDIndex(this);

        return null;
    }

    @Transient
    public NamespaceManager getNamespaceManager() {
        return new NamespaceManager(this);
    }

    @Transient
    public Set<Namespace> getNamespaces() {
        return this.getNamespaceManager().getNamespaces();
    }

    @Nullable
    public String getNoNamespaceSchemaLocation() {
        return null;
    }

    @Nullable
    public List<XMLObject> getOrderedChildren() {
        return null;
    }

    @Nullable
    public XMLObject getParent() {
        return null;
    }

    @Nullable
    public String getSchemaLocation() {
        return null;
    }

    @Nullable
    public QName getSchemaType() {
        if (this.schemaTypeElementLocalName == null) {
            return null;
        }
        return QNameSupport.constructQName(this.schemaTypeNamespaceURI, this.schemaTypeElementLocalName, this.schemaTypeNamespacePrefix);
    }

    public void setSchemaType(QName schemaType) {
        if (schemaType != null) {
            this.schemaTypeNamespaceURI = schemaType.getNamespaceURI();
            this.schemaTypeElementLocalName = schemaType.getLocalPart();
            this.schemaTypeNamespacePrefix = schemaType.getPrefix();
        }
    }

    public boolean hasChildren() {
        return false;
    }

    public boolean hasParent() {
        return false;
    }

    public void releaseChildrenDOM(boolean b) {

    }

    public void releaseDOM() {

    }

    public void releaseParentDOM(boolean b) {

    }

    @Nullable
    public XMLObject resolveID(@Nonnull String s) {
        return null;
    }

    @Nullable
    public XMLObject resolveIDFromRoot(@Nonnull String s) {
        return null;
    }

    public void setDOM(@Nullable Element element) {

    }

    public void setNoNamespaceSchemaLocation(@Nullable String s) {

    }

    public void setParent(@Nullable XMLObject xmlObject) {

    }

    public void setSchemaLocation(@Nullable String s) {

    }

    @Nullable
    public Boolean isNil() {
        return null;
    }

    @Nullable
    public XSBooleanValue isNilXSBoolean() {
        return null;
    }

    public void setNil(@Nullable Boolean aBoolean) {

    }

    public void setNil(@Nullable XSBooleanValue xsBooleanValue) {

    }

    @Nonnull
    public LockableClassToInstanceMultiMap<Object> getObjectMetadata() {
        return null;
    }

    public String getSchemaTypeNamespaceURI() {
        return schemaTypeNamespaceURI;
    }

    public void setSchemaTypeNamespaceURI(String schemaTypeNamespaceURI) {
        this.schemaTypeNamespaceURI = schemaTypeNamespaceURI;
    }

    public String getSchemaTypeElementLocalName() {
        return schemaTypeElementLocalName;
    }

    public void setSchemaTypeElementLocalName(String schemaTypeElementLocalName) {
        this.schemaTypeElementLocalName = schemaTypeElementLocalName;
    }

    public String getSchemaTypeNamespacePrefix() {
        return schemaTypeNamespacePrefix;
    }

    public void setSchemaTypeNamespacePrefix(String schemaTypeNamespacePrefix) {
        this.schemaTypeNamespacePrefix = schemaTypeNamespacePrefix;
    }
}
