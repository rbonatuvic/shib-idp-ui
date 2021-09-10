package edu.internet2.tier.shibboleth.admin.ui.domain;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import edu.internet2.tier.shibboleth.admin.util.BundleableAttributeTypeValueSerializer;

@JsonSerialize(using = BundleableAttributeTypeValueSerializer.class)
public enum BundleableAttributeType {
            EDUPERSONPRINCIPALNAME("eduPersonPrincipalName"),
            UID("uid"),
            MAIL("mail"),
            SURNAME("surname"),
            GIVENNAME("givenName"),
            EDUPERSONAFFILIATE("eduPersonAffiliation"),
            EDUPERSONSCOPEDAFFILIATION("eduPersonScopedAffiliation"),
            EDUPERSONPRIMARYAFFILIATION("eduPersonPrimaryAffiliation"),
            EDUPERSONENTITLEMENT("eduPersonEntitlement"),
            EDUPERSONASSURANCE("eduPersonAssurance"),
            EDUPERSONUNIQUEID("eduPersonUniqueId"),
            EMPLOYEENUMBER("employeeNumber");

    String label;

    BundleableAttributeType(String val) {
            label = val;
        }

    public String label() {return label;}

    public static BundleableAttributeType valueOfLabel(String label) {
        for (BundleableAttributeType e : values()) {
            if (e.name().equals(label)) {
                return e;
            }
        }
        return null;
    }

}