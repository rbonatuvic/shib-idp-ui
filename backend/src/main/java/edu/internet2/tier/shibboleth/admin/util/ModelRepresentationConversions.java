package edu.internet2.tier.shibboleth.admin.util;

import edu.internet2.tier.shibboleth.admin.ui.domain.Attribute;
import edu.internet2.tier.shibboleth.admin.ui.domain.XSBoolean;
import org.opensaml.core.xml.XMLObject;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Utility class to deal with model conversions related functionality
 */
public abstract class ModelRepresentationConversions {

    public static List<String> getStringListOfAttributeValues(List<XMLObject> attributeValues) {
        List<String> stringAttributeValues = new ArrayList<>();
        for (XMLObject attributeValue : attributeValues) {
            if (attributeValue instanceof org.opensaml.core.xml.schema.XSString) {
                stringAttributeValues.add(((org.opensaml.core.xml.schema.XSString) attributeValue).getValue());
            } else if (attributeValue instanceof org.opensaml.core.xml.schema.XSAny) {
                stringAttributeValues.add(((org.opensaml.core.xml.schema.XSAny) attributeValue).getTextContent());
            }
        }
        return stringAttributeValues;
    }

    public static List<String> getAttributeReleaseListFromAttributeList(List<Attribute> attributeList) {
        List<Attribute> releaseAttributes = attributeList.stream()
                .filter(attribute -> attribute.getName().equals(MDDCConstants.RELEASE_ATTRIBUTES))
                .collect(Collectors.toList());

        if (releaseAttributes.size() != 1) {
            // TODO: What do we do if there is more than one?
        }
        if (releaseAttributes.size() == 0) {
            return new ArrayList<>();
        } else {
            return getStringListOfAttributeValues(releaseAttributes.get(0).getAttributeValues());
        }
    }

    public static boolean getBooleanValueOfAttribute(Attribute attribute) {
        return ((XSBoolean) attribute.getAttributeValues().get(0)).getValue().getValue();
    }

    public static List<String> getStringListValueOfAttribute(Attribute attribute) {
        return getStringListOfAttributeValues(attribute.getAttributeValues());
    }


}
