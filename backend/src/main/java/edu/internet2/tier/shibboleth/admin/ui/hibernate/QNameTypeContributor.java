package edu.internet2.tier.shibboleth.admin.ui.hibernate;

import org.hibernate.boot.model.TypeContributions;
import org.hibernate.boot.model.TypeContributor;
import org.hibernate.service.ServiceRegistry;

import javax.xml.namespace.QName;

public class QNameTypeContributor implements TypeContributor {

    @Override
    public void contribute(TypeContributions typeContributions, ServiceRegistry serviceRegistry) {
        typeContributions.contributeType(new QNameUserType(), "qname", QName.class.getName());
    }
}
