package edu.internet2.tier.shibboleth.admin.ui.domain.filters.algorithm;

import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractXMLObject;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.SignatureValidationFilter;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.envers.Audited;
import org.opensaml.core.xml.ElementExtensibleXMLObject;
import org.opensaml.core.xml.XMLObject;

import javax.annotation.Nonnull;
import javax.persistence.CascadeType;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import javax.xml.namespace.QName;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Following the pattern of AbstractElementExtensibleXMLObject - this XML type can hold a couple of different types of XML objects
 */
@Entity
@Audited
@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
public class AlgorithmFilter extends MetadataFilter {
    @OneToMany(cascade = CascadeType.ALL)
    @OrderColumn
    private List<AbstractXMLObject> unknownXMLObjects = new ArrayList<>();

    public void addUnknownXMLObject(AbstractXMLObject xmlObject) {
        this.unknownXMLObjects.add(xmlObject);
    }

    @Nonnull
    public List<XMLObject> getUnknownXMLObjects() {
        return (List<XMLObject>) (List<? extends XMLObject>) this.unknownXMLObjects;
    }

    private AlgorithmFilter updateConcreteFilterTypeData(AlgorithmFilter filterToBeUpdated) {
        for (XMLObject o : getUnknownXMLObjects()) {
            filterToBeUpdated.addUnknownXMLObject((AbstractXMLObject) o);
        }
        return filterToBeUpdated;
    }

    @Override
    public MetadataFilter updateConcreteFilterTypeData(MetadataFilter filterToBeUpdated) {
        return updateConcreteFilterTypeData((AlgorithmFilter) filterToBeUpdated);
    }
}