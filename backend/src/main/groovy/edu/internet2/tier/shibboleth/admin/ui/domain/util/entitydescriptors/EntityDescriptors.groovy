package edu.internet2.tier.shibboleth.admin.ui.domain.util.entitydescriptors

import edu.internet2.tier.shibboleth.admin.ui.domain.ContactPerson
import edu.internet2.tier.shibboleth.admin.ui.domain.EmailAddress
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.GivenName
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import org.opensaml.saml.saml2.metadata.ContactPersonTypeEnumeration

/**
 * Utility class to statically construct a graph of EntityDescriptor objects useful for dev and testing.
 */
final class EntityDescriptors {

    private EntityDescriptors() {
    }

    static EntityDescriptor prebakedEntityDescriptor(OpenSamlObjects openSamlObjects) {
        openSamlObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
            it.contactPersons = [openSamlObjects.buildDefaultInstanceOfType(ContactPerson.class).with {
                it.type = ContactPersonTypeEnumeration.ADMINISTRATIVE
                it.givenName = openSamlObjects.buildDefaultInstanceOfType(GivenName.class).with {
                    it.name = 'name'
                    it
                }
                it.emailAddresses.add(openSamlObjects.buildDefaultInstanceOfType(EmailAddress.class).with {
                    it.address = 'test@test'
                    it
                })
                it
            }]


            //Main ed
            it
        }
    }


}
