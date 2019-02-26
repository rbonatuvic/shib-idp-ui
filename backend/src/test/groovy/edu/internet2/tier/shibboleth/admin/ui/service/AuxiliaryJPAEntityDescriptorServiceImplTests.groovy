package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.domain.ContactPerson
import edu.internet2.tier.shibboleth.admin.ui.domain.EmailAddress
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.GivenName
import edu.internet2.tier.shibboleth.admin.ui.domain.KeyDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.NameIDFormat
import edu.internet2.tier.shibboleth.admin.ui.domain.SPSSODescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.SingleLogoutService
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.ContactRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.LogoutEndpointRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.SecurityInfoRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.ServiceProviderSsoDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import org.opensaml.saml.common.xml.SAMLConstants
import org.opensaml.saml.saml2.metadata.ContactPersonTypeEnumeration
import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Unroll

class AuxiliaryJPAEntityDescriptorServiceImplTests extends Specification {
    @Shared
    def openSAMLObjects = new OpenSamlObjects().with {
        it.init()
        it
    }

    @Shared
    JPAEntityDescriptorServiceImpl entityDescriptorService

    void setup() {
        entityDescriptorService = new JPAEntityDescriptorServiceImpl(openSAMLObjects, null, null)
    }

    def "simple test"() {
        assert true
    }

    @Unroll
    def "test #method(#description)"() {
        setup:
        expected.setResourceId(starter.getResourceId())
        entityDescriptorService."$method"(starter, representation)

        expect:
        assert starter == expected

        where:
        [method, description, representation, starter, expected] << Data.getData(openSAMLObjects)
    }

    def "test createKeyDescriptor, single type"() {
        given:
        def expectedXml = '''<md:KeyDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" use="signing">
  <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
    <ds:X509Data>
      <ds:X509Certificate>testValue</ds:X509Certificate>
    </ds:X509Data>
  </ds:KeyInfo>
</md:KeyDescriptor>'''
        def expected = openSAMLObjects.unmarshallFromXml(expectedXml.bytes, KeyDescriptor)
        expected.name = 'testName'

        when:
        def keyDescriptor = entityDescriptorService.createKeyDescriptor('testName', 'signing', 'testValue')

        then:
        assert keyDescriptor == expected
    }

    def "test createKeyDescriptor, both type"() {
        given:
        def expectedXml = '''<md:KeyDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata">
  <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
    <ds:X509Data>
      <ds:X509Certificate>testValue</ds:X509Certificate>
    </ds:X509Data>
  </ds:KeyInfo>
</md:KeyDescriptor>'''
        def expected = openSAMLObjects.unmarshallFromXml(expectedXml.bytes, KeyDescriptor)
        expected.name = 'testName'

        when:
        def keyDescriptor = entityDescriptorService.createKeyDescriptor('testName', 'both', 'testValue')
        def x = openSAMLObjects.marshalToXmlString(keyDescriptor)
        then:
        assert keyDescriptor == expected
    }

    static class Data {
        static def getData(OpenSamlObjects openSAMLObjects) {
            def data = []

            data << new DataField(
                    method: 'setupLogout',
                    description: 'no change',
                    representation: new EntityDescriptorRepresentation(),
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class),
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class)
            )
            data << new DataField(
                    method: 'setupLogout',
                    description: 'add logout',
                    representation: new EntityDescriptorRepresentation().with {
                        it.logoutEndpoints = [new LogoutEndpointRepresentation(bindingType: 'testBinding', url: 'testLocation')]
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class),
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.getSingleLogoutServices().add(
                                            openSAMLObjects.buildDefaultInstanceOfType(SingleLogoutService.class).with {
                                                it.binding = 'testBinding'
                                                it.location = 'testLocation'
                                                it
                                            }
                                    )
                                    it
                                }
                        )
                        it
                    }
            )
            data << new DataField(
                    method: 'setupLogout',
                    description: 'remove logout',
                    representation: new EntityDescriptorRepresentation(),
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.getSingleLogoutServices().add(
                                            openSAMLObjects.buildDefaultInstanceOfType(SingleLogoutService.class).with {
                                                it.binding = 'testBinding'
                                                it.location = 'testLocation'
                                                it
                                            }
                                    )
                                    it
                                }
                        )
                        it
                    },
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class))
                        it
                    }
            )
            data << new DataField(
                    method: 'setupLogout',
                    description: 'modify logout',
                    representation: new EntityDescriptorRepresentation().with {
                        it.logoutEndpoints = [new LogoutEndpointRepresentation(bindingType: 'testBinding', url: 'testLocation')]
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.getSingleLogoutServices().add(
                                            openSAMLObjects.buildDefaultInstanceOfType(SingleLogoutService.class).with {
                                                it.binding = 'startBinding'
                                                it.location = 'startLocation'
                                                it
                                            }
                                    )
                                    it
                                }
                        )
                        it
                    },
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.getSingleLogoutServices().add(
                                            openSAMLObjects.buildDefaultInstanceOfType(SingleLogoutService.class).with {
                                                it.binding = 'testBinding'
                                                it.location = 'testLocation'
                                                it
                                            }
                                    )
                                    it
                                }
                        )
                        it
                    },
            )
            data << new DataField(
                    method: 'setupContacts',
                    description: 'add contact to empty descriptor',
                    representation: new EntityDescriptorRepresentation().with {
                        it.contacts = [new ContactRepresentation(type: 'administrative', name: 'name', emailAddress: 'test@test', displayName: 'displayName', url: 'http://url')]
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class),
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.contactPersons = [openSAMLObjects.buildDefaultInstanceOfType(ContactPerson.class).with {
                            it.type = ContactPersonTypeEnumeration.ADMINISTRATIVE
                            it.givenName = openSAMLObjects.buildDefaultInstanceOfType(GivenName.class).with {
                                it.name = 'name'
                                it
                            }
                            it.emailAddresses.add(openSAMLObjects.buildDefaultInstanceOfType(EmailAddress.class).with {
                                it.address = 'test@test'
                                it
                            })
                            it
                        }]
                        it
                    }
            )
            data << new DataField(
                    method: 'setupContacts',
                    description: 'add contant to non-empty descriptor',
                    representation: new EntityDescriptorRepresentation().with {
                        it.contacts = [
                                new ContactRepresentation(type: 'administrative', name: 'name', emailAddress: 'test@test', displayName: 'displayName', url: 'http://url'),
                                new ContactRepresentation(type: 'technical', name: 'name2', emailAddress: 'test2@test', displayName: 'displayName2', url: 'http://url2')
                        ]
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.contactPersons = [openSAMLObjects.buildDefaultInstanceOfType(ContactPerson.class).with {
                            it.type = ContactPersonTypeEnumeration.ADMINISTRATIVE
                            it.givenName = openSAMLObjects.buildDefaultInstanceOfType(GivenName.class).with {
                                it.name = 'name'
                                it
                            }
                            it.emailAddresses.add(openSAMLObjects.buildDefaultInstanceOfType(EmailAddress.class).with {
                                it.address = 'test@test'
                                it
                            })
                            it
                        }]
                        it
                    },
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.contactPersons = [
                                openSAMLObjects.buildDefaultInstanceOfType(ContactPerson.class).with {
                                    it.type = ContactPersonTypeEnumeration.ADMINISTRATIVE
                                    it.givenName = openSAMLObjects.buildDefaultInstanceOfType(GivenName.class).with {
                                        it.name = 'name'
                                        it
                                    }
                                    it.emailAddresses.add(openSAMLObjects.buildDefaultInstanceOfType(EmailAddress.class).with {
                                        it.address = 'test@test'
                                        it
                                    })
                                    it
                                },
                                openSAMLObjects.buildDefaultInstanceOfType(ContactPerson.class).with {
                                    it.type = ContactPersonTypeEnumeration.TECHNICAL
                                    it.givenName = openSAMLObjects.buildDefaultInstanceOfType(GivenName.class).with {
                                        it.name = 'name2'
                                        it
                                    }
                                    it.emailAddresses.add(openSAMLObjects.buildDefaultInstanceOfType(EmailAddress.class).with {
                                        it.address = 'test2@test'
                                        it
                                    })
                                    it
                                }]
                        it
                    }
            )
            data << new DataField(
                    method: 'setupContacts',
                    description: 'update contact',
                    representation: new EntityDescriptorRepresentation().with {
                        it.contacts = [new ContactRepresentation(type: 'technical', name: 'name2', emailAddress: 'test2@test', displayName: 'displayName', url: 'http://url')]
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.contactPersons = [openSAMLObjects.buildDefaultInstanceOfType(ContactPerson.class).with {
                            it.type = ContactPersonTypeEnumeration.ADMINISTRATIVE
                            it.givenName = openSAMLObjects.buildDefaultInstanceOfType(GivenName.class).with {
                                it.name = 'name'
                                it
                            }
                            it.emailAddresses.add(openSAMLObjects.buildDefaultInstanceOfType(EmailAddress.class).with {
                                it.address = 'test@test'
                                it
                            })
                            it
                        }]
                        it
                    },
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.contactPersons = [openSAMLObjects.buildDefaultInstanceOfType(ContactPerson.class).with {
                            it.type = ContactPersonTypeEnumeration.TECHNICAL
                            it.givenName = openSAMLObjects.buildDefaultInstanceOfType(GivenName.class).with {
                                it.name = 'name2'
                                it
                            }
                            it.emailAddresses.add(openSAMLObjects.buildDefaultInstanceOfType(EmailAddress.class).with {
                                it.address = 'test2@test'
                                it
                            })
                            it
                        }]
                        it
                    }
            )
            data << new DataField(
                    method: 'setupContacts',
                    description: 'delete contacts',
                    representation: new EntityDescriptorRepresentation(),
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.contactPersons = [openSAMLObjects.buildDefaultInstanceOfType(ContactPerson.class).with {
                            it.type = ContactPersonTypeEnumeration.ADMINISTRATIVE
                            it.givenName = openSAMLObjects.buildDefaultInstanceOfType(GivenName.class).with {
                                it.name = 'name'
                                it
                            }
                            it.emailAddresses.add(openSAMLObjects.buildDefaultInstanceOfType(EmailAddress.class).with {
                                it.address = 'test@test'
                                it
                            })
                            it
                        }]
                        it
                    },
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class)
            )
            data << new DataField(
                    method: 'setupSPSSODescriptor',
                    description: 'set SPSSODescriptor protocol support',
                    representation: new EntityDescriptorRepresentation().with {
                        it.serviceProviderSsoDescriptor = new ServiceProviderSsoDescriptorRepresentation().with {
                            it.protocolSupportEnum = 'SAML 2'
                            it
                        }
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class),
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.supportedProtocols = [SAMLConstants.SAML20P_NS]
                                    it
                                }
                        )
                        it
                    }
            )
            data << new DataField(
                    method: 'setupSPSSODescriptor',
                    description: 'add SPSSODescriptor protocol support',
                    representation: new EntityDescriptorRepresentation().with {
                        it.serviceProviderSsoDescriptor = new ServiceProviderSsoDescriptorRepresentation().with {
                            it.protocolSupportEnum = 'SAML 1.1,SAML 2'
                            it
                        }
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.supportedProtocols = [SAMLConstants.SAML20P_NS]
                                    it
                                }
                        )
                        it
                    },
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.supportedProtocols = [SAMLConstants.SAML11P_NS, SAMLConstants.SAML20P_NS]
                                    it
                                }
                        )
                        it
                    }
            )
            data << new DataField(
                    method: 'setupSPSSODescriptor',
                    description: 'remove SPSSODescriptor',
                    representation: new EntityDescriptorRepresentation(),
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.supportedProtocols = [SAMLConstants.SAML20P_NS]
                                    it
                                }
                        )
                        it
                    },
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class)
            )
            data << new DataField(
                    method: 'setupSPSSODescriptor',
                    description: 'set nameid formats',
                    representation: new EntityDescriptorRepresentation().with {
                        it.serviceProviderSsoDescriptor = new ServiceProviderSsoDescriptorRepresentation().with {
                            it.nameIdFormats = ['testformat']
                            it
                        }
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class),
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.nameIDFormats.add(openSAMLObjects.buildDefaultInstanceOfType(NameIDFormat.class).with {
                                        it.format = 'testformat'
                                        it
                                    })
                                    it
                                }
                        )
                        it
                    }
            )
            data << new DataField(
                    method: 'setupSPSSODescriptor',
                    description: 'add nameid formats',
                    representation: new EntityDescriptorRepresentation().with {
                        it.serviceProviderSsoDescriptor = new ServiceProviderSsoDescriptorRepresentation().with {
                            it.nameIdFormats = ['testformat', 'anotherformat']
                            it
                        }
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.nameIDFormats.add(openSAMLObjects.buildDefaultInstanceOfType(NameIDFormat.class).with {
                                        it.format = 'testformat'
                                        it
                                    })
                                    it
                                }
                        )
                        it
                    },
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.nameIDFormats.add(openSAMLObjects.buildDefaultInstanceOfType(NameIDFormat.class).with {
                                        it.format = 'testformat'
                                        it
                                    })
                                    it.nameIDFormats.add(openSAMLObjects.buildDefaultInstanceOfType(NameIDFormat.class).with {
                                        it.format = 'anotherformat'
                                        it
                                    })
                                    it
                                }
                        )
                        it
                    }
            )
            data << new DataField(
                    method: 'setupSPSSODescriptor',
                    description: 'remove nameid format',
                    representation: new EntityDescriptorRepresentation().with {
                        it.serviceProviderSsoDescriptor = new ServiceProviderSsoDescriptorRepresentation().with {
                            it.nameIdFormats = ['anotherformat']
                            it
                        }
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.nameIDFormats.add(openSAMLObjects.buildDefaultInstanceOfType(NameIDFormat.class).with {
                                        it.format = 'testformat'
                                        it
                                    })
                                    it.nameIDFormats.add(openSAMLObjects.buildDefaultInstanceOfType(NameIDFormat.class).with {
                                        it.format = 'anotherformat'
                                        it
                                    })
                                    it
                                }
                        )
                        it
                    },
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.nameIDFormats.add(openSAMLObjects.buildDefaultInstanceOfType(NameIDFormat.class).with {
                                        it.format = 'anotherformat'
                                        it
                                    })
                                    it
                                }
                        )
                        it
                    }
            )
            data << new DataField(
                    method: 'setupSecurity',
                    description: 'set authentication requests signed to true',
                    representation: new EntityDescriptorRepresentation().with {
                        it.securityInfo = new SecurityInfoRepresentation(authenticationRequestsSigned: true)
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class),
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.authnRequestsSigned = true
                                    it
                                }
                        )
                        it
                    }
            )
            data << new DataField(
                    method: 'setupSecurity',
                    description: 'unset authentication requests signed to true',
                    representation: new EntityDescriptorRepresentation(),
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.authnRequestsSigned = true
                                    it
                                }
                        )
                        it
                    },
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class)
                        )
                        it
                    }
            )
            data << new DataField(
                    method: 'setupSecurity',
                    description: 'set want assertions signed to true',
                    representation: new EntityDescriptorRepresentation().with {
                        it.securityInfo = new SecurityInfoRepresentation(wantAssertionsSigned: true)
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class),
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.wantAssertionsSigned = true
                                    it
                                }
                        )
                        it
                    }
            )
            data << new DataField(
                    method: 'setupSecurity',
                    description: 'unset want assertions signed',
                    representation: new EntityDescriptorRepresentation(),
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.wantAssertionsSigned = true
                                    it
                                }
                        )
                        it
                    },
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class)
                        )
                        it
                    }
            )


            return data
        }


        static class DataField implements Iterable {
            String method
            String description
            EntityDescriptorRepresentation representation
            EntityDescriptor starter
            EntityDescriptor expected

            @Override
            Iterator iterator() {
                return [this.method, this.description, this.representation, this.starter, this.expected].iterator()
            }
        }
    }
}
