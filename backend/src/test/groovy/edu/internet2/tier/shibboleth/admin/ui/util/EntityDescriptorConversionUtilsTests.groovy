package edu.internet2.tier.shibboleth.admin.ui.util


import edu.internet2.tier.shibboleth.admin.ui.domain.ContactPerson
import edu.internet2.tier.shibboleth.admin.ui.domain.Description
import edu.internet2.tier.shibboleth.admin.ui.domain.DisplayName
import edu.internet2.tier.shibboleth.admin.ui.domain.EmailAddress
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.Extensions
import edu.internet2.tier.shibboleth.admin.ui.domain.GivenName
import edu.internet2.tier.shibboleth.admin.ui.domain.InformationURL
import edu.internet2.tier.shibboleth.admin.ui.domain.KeyDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.Logo
import edu.internet2.tier.shibboleth.admin.ui.domain.NameIDFormat
import edu.internet2.tier.shibboleth.admin.ui.domain.PrivacyStatementURL
import edu.internet2.tier.shibboleth.admin.ui.domain.SPSSODescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.SingleLogoutService
import edu.internet2.tier.shibboleth.admin.ui.domain.UIInfo
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.ContactRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.KeyDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.LogoutEndpointRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.MduiRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.SecurityInfoRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.ServiceProviderSsoDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.util.EntityDescriptorConversionUtils
import org.opensaml.saml.common.xml.SAMLConstants
import org.opensaml.saml.saml2.metadata.ContactPersonTypeEnumeration
import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Unroll

class EntityDescriptorConversionUtilsTests extends Specification {
    @Shared
    OpenSamlObjects openSAMLObjects
    
    def setup() {
        openSAMLObjects = new OpenSamlObjects().with {
            it.init()
            it
        }

        new EntityDescriptorConversionUtils().with {
            it.openSamlObjects = openSAMLObjects
            it
        }
    }
    
    def "test createKeyDescriptor, single type"() {
        given:
        def expectedXml = '''<md:KeyDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" use="signing">
  <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
    <ds:KeyName>testName</ds:KeyName>
    <ds:X509Data>
      <ds:X509Certificate>testValue</ds:X509Certificate>
    </ds:X509Data>
  </ds:KeyInfo>
</md:KeyDescriptor>'''

        when:
        def keyDescriptor = EntityDescriptorConversionUtils.createKeyDescriptor('testName', 'signing', 'testValue', KeyDescriptorRepresentation.ElementType.X509Data)
        def generated = openSAMLObjects.marshalToXmlString(keyDescriptor)

        then:
        TestHelpers.generatedXmlIsTheSameAsExpectedXml(expectedXml, generated)
    }
    
    def "test createKeyDescriptor, both type"() {
        given:
        def expectedXml = '''<md:KeyDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata">
  <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
    <ds:KeyName>testName</ds:KeyName>
    <ds:X509Data>
      <ds:X509Certificate>testValue</ds:X509Certificate>
    </ds:X509Data>
  </ds:KeyInfo>
</md:KeyDescriptor>'''

        when:
        def keyDescriptor = EntityDescriptorConversionUtils.createKeyDescriptor('testName', 'both', 'testValue', KeyDescriptorRepresentation.ElementType.X509Data)
        def generated = openSAMLObjects.marshalToXmlString(keyDescriptor)

        then:
        TestHelpers.generatedXmlIsTheSameAsExpectedXml(expectedXml, generated)
    }

    def 'test createKeyDescriptor equality'() {
        when:
        def key1 = EntityDescriptorConversionUtils.createKeyDescriptor('test', 'signing', 'test', KeyDescriptorRepresentation.ElementType.X509Data)
        def key2 = EntityDescriptorConversionUtils.createKeyDescriptor('test', 'signing', 'test', KeyDescriptorRepresentation.ElementType.X509Data)

        then:
        assert key1 == key2
    }
    
    @Unroll
    def "test #method(#description)"() {
        setup:
        expected.setResourceId(starter.getResourceId())
        EntityDescriptorConversionUtils."$method"(starter, representation)

        expect:
        assert starter == expected

        where:
        [method, description, representation, starter, expected] << Data.getData(openSAMLObjects)
    }

    static class Data {
        static def getData(OpenSamlObjects openSAMLObjects) {
            EntityDescriptorConversionUtils utilsUnderTest = new EntityDescriptorConversionUtils().with {
                it.openSamlObjects = openSAMLObjects
                it
            }
            
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
            data << new DataField(
                    method: 'setupSecurity',
                    description: 'add signing certificate',
                    representation: new EntityDescriptorRepresentation().with {
                        it.securityInfo = new SecurityInfoRepresentation().with {
                            it.keyDescriptors = [
                                    new KeyDescriptorRepresentation(name: 'test', type: 'signing', value: 'test', elementType: KeyDescriptorRepresentation.ElementType.X509Data)
                            ]
                            it
                        }
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class),
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.addKeyDescriptor(
                                        utilsUnderTest.createKeyDescriptor('test', 'signing', 'test', KeyDescriptorRepresentation.ElementType.X509Data))
                                    it
                                }
                        )
                        it
                    }
            )
            data << new DataField(
                    method: 'setupSecurity',
                    description: 'add another certificate',
                    representation: new EntityDescriptorRepresentation().with {
                        it.securityInfo = new SecurityInfoRepresentation().with {
                            it.keyDescriptors = [
                                    new KeyDescriptorRepresentation(name: 'test', type: 'signing', value: 'test', elementType: KeyDescriptorRepresentation.ElementType.X509Data),
                                    new KeyDescriptorRepresentation(name: 'test2', type: 'encryption', value: 'test2', elementType: KeyDescriptorRepresentation.ElementType.X509Data)
                            ]
                            it
                        }
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.addKeyDescriptor(utilsUnderTest.createKeyDescriptor('test', 'signing', 'test', KeyDescriptorRepresentation.ElementType.X509Data))
                                    it
                                }
                        )
                        it
                    },
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.addKeyDescriptor(utilsUnderTest.createKeyDescriptor('test', 'signing', 'test', KeyDescriptorRepresentation.ElementType.X509Data))
                                    it.addKeyDescriptor(utilsUnderTest.createKeyDescriptor('test2', 'encryption', 'test2', KeyDescriptorRepresentation.ElementType.X509Data))
                                    it
                                }
                        )
                        it
                    }
            )
            data << new DataField(
                    method: 'setupSecurity',
                    description: 'remove a certificate',
                    representation: new EntityDescriptorRepresentation().with {
                        it.securityInfo = new SecurityInfoRepresentation().with {
                            it.keyDescriptors = [
                                    new KeyDescriptorRepresentation(name: 'test2', type: 'encryption', value: 'test2', elementType: KeyDescriptorRepresentation.ElementType.X509Data)
                            ]
                            it
                        }
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.addKeyDescriptor(utilsUnderTest.createKeyDescriptor('test', 'signing', 'test', KeyDescriptorRepresentation.ElementType.X509Data))
                                    it.addKeyDescriptor(utilsUnderTest.createKeyDescriptor('test2', 'encryption', 'test2', KeyDescriptorRepresentation.ElementType.X509Data))
                                    it
                                }
                        )
                        it
                    },
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.addKeyDescriptor(utilsUnderTest.createKeyDescriptor('test2', 'encryption', 'test2', KeyDescriptorRepresentation.ElementType.X509Data))
                                    it
                                }
                        )
                        it
                    }
            )
            data << new DataField(
                    method: 'setupSecurity',
                    description: 'remove all certificates',
                    representation: new EntityDescriptorRepresentation().with {
                        it.securityInfo = new SecurityInfoRepresentation().with {
                            it
                        }
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.addKeyDescriptor(utilsUnderTest.createKeyDescriptor('test', 'signing', 'test', KeyDescriptorRepresentation.ElementType.X509Data))
                                    it.addKeyDescriptor(utilsUnderTest.createKeyDescriptor('test', 'encryption', 'test', KeyDescriptorRepresentation.ElementType.X509Data))
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
                    description: 'remove all certificates',
                    representation: new EntityDescriptorRepresentation(),
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor.class).with {
                        it.getRoleDescriptors().add(
                                openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor.class).with {
                                    it.addKeyDescriptor(utilsUnderTest.createKeyDescriptor('test', 'signing', 'test', KeyDescriptorRepresentation.ElementType.X509Data))
                                    it.addKeyDescriptor(utilsUnderTest.createKeyDescriptor('test', 'encryption', 'test', KeyDescriptorRepresentation.ElementType.X509Data))
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
                    method: 'setupUIInfo',
                    description: 'set display name',
                    representation: new EntityDescriptorRepresentation().with {
                        it.mdui = new MduiRepresentation().with {
                            it.displayName = 'test name'
                            it
                        }
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor),
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor).with {
                        it.roleDescriptors.add(openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor).with {
                            it.extensions = openSAMLObjects.buildDefaultInstanceOfType(Extensions).with {
                                it.unknownXMLObjects.add(openSAMLObjects.buildDefaultInstanceOfType(UIInfo).with {
                                    it.XMLObjects.add(openSAMLObjects.buildDefaultInstanceOfType(DisplayName).with {
                                        it.value = 'test name'
                                        it.XMLLang = 'en'
                                        it
                                    })
                                    it
                                })
                                it
                            }
                            it
                        })
                        it
                    }
            )
            data << new DataField(
                    method: 'setupUIInfo',
                    description: 'remove display name',
                    representation: new EntityDescriptorRepresentation().with {
                        it.mdui = new MduiRepresentation().with {
                            it
                        }
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor).with {
                        it.roleDescriptors.add(openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor).with {
                            it.extensions = openSAMLObjects.buildDefaultInstanceOfType(Extensions).with {
                                it.unknownXMLObjects.add(openSAMLObjects.buildDefaultInstanceOfType(UIInfo).with {
                                    it.XMLObjects.add(openSAMLObjects.buildDefaultInstanceOfType(DisplayName).with {
                                        it.value = 'test name'
                                        it.XMLLang = 'en'
                                        it
                                    })
                                    it
                                })
                                it
                            }
                            it
                        })
                        it
                    },
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor).with {
                        it.roleDescriptors.add(openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor).with {
                            it.extensions = openSAMLObjects.buildDefaultInstanceOfType(Extensions).with {
                                it
                            }
                            it
                        })
                        it
                    }
            )
            data << new DataField(
                    method: 'setupUIInfo',
                    description: 'set information URL',
                    representation: new EntityDescriptorRepresentation().with {
                        it.mdui = new MduiRepresentation().with {
                            it.informationUrl = 'http://test'
                            it
                        }
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor),
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor).with {
                        it.roleDescriptors.add(openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor).with {
                            it.extensions = openSAMLObjects.buildDefaultInstanceOfType(Extensions).with {
                                it.unknownXMLObjects.add(openSAMLObjects.buildDefaultInstanceOfType(UIInfo).with {
                                    it.XMLObjects.add(openSAMLObjects.buildDefaultInstanceOfType(InformationURL).with {
                                        it.value = 'http://test'
                                        it.XMLLang = 'en'
                                        it
                                    })
                                    it
                                })
                                it
                            }
                            it
                        })
                        it
                    }
            )
            data << new DataField(
                    method: 'setupUIInfo',
                    description: 'remove information url',
                    representation: new EntityDescriptorRepresentation().with {
                        it.mdui = new MduiRepresentation().with {
                            it
                        }
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor).with {
                        it.roleDescriptors.add(openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor).with {
                            it.extensions = openSAMLObjects.buildDefaultInstanceOfType(Extensions).with {
                                it.unknownXMLObjects.add(openSAMLObjects.buildDefaultInstanceOfType(UIInfo).with {
                                    it.XMLObjects.add(openSAMLObjects.buildDefaultInstanceOfType(InformationURL).with {
                                        it.value = 'http://test'
                                        it.XMLLang = 'en'
                                        it
                                    })
                                    it
                                })
                                it
                            }
                            it
                        })
                        it
                    },
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor).with {
                        it.roleDescriptors.add(openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor).with {
                            it.extensions = openSAMLObjects.buildDefaultInstanceOfType(Extensions).with {
                                it
                            }
                            it
                        })
                        it
                    }
            )
            data << new DataField(
                    method: 'setupUIInfo',
                    description: 'set privacy statement URL',
                    representation: new EntityDescriptorRepresentation().with {
                        it.mdui = new MduiRepresentation().with {
                            it.privacyStatementUrl = 'http://test'
                            it
                        }
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor),
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor).with {
                        it.roleDescriptors.add(openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor).with {
                            it.extensions = openSAMLObjects.buildDefaultInstanceOfType(Extensions).with {
                                it.unknownXMLObjects.add(openSAMLObjects.buildDefaultInstanceOfType(UIInfo).with {
                                    it.XMLObjects.add(openSAMLObjects.buildDefaultInstanceOfType(PrivacyStatementURL).with {
                                        it.value = 'http://test'
                                        it.XMLLang = 'en'
                                        it
                                    })
                                    it
                                })
                                it
                            }
                            it
                        })
                        it
                    }
            )
            data << new DataField(
                    method: 'setupUIInfo',
                    description: 'remove information url',
                    representation: new EntityDescriptorRepresentation().with {
                        it.mdui = new MduiRepresentation().with {
                            it
                        }
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor).with {
                        it.roleDescriptors.add(openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor).with {
                            it.extensions = openSAMLObjects.buildDefaultInstanceOfType(Extensions).with {
                                it.unknownXMLObjects.add(openSAMLObjects.buildDefaultInstanceOfType(UIInfo).with {
                                    it.XMLObjects.add(openSAMLObjects.buildDefaultInstanceOfType(PrivacyStatementURL).with {
                                        it.value = 'http://test'
                                        it.XMLLang = 'en'
                                        it
                                    })
                                    it
                                })
                                it
                            }
                            it
                        })
                        it
                    },
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor).with {
                        it.roleDescriptors.add(openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor).with {
                            it.extensions = openSAMLObjects.buildDefaultInstanceOfType(Extensions).with {
                                it
                            }
                            it
                        })
                        it
                    }
            )
            data << new DataField(
                    method: 'setupUIInfo',
                    description: 'set description',
                    representation: new EntityDescriptorRepresentation().with {
                        it.mdui = new MduiRepresentation().with {
                            it.description = 'test description'
                            it
                        }
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor),
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor).with {
                        it.roleDescriptors.add(openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor).with {
                            it.extensions = openSAMLObjects.buildDefaultInstanceOfType(Extensions).with {
                                it.unknownXMLObjects.add(openSAMLObjects.buildDefaultInstanceOfType(UIInfo).with {
                                    it.XMLObjects.add(openSAMLObjects.buildDefaultInstanceOfType(Description).with {
                                        it.value = 'test description'
                                        it.XMLLang = 'en'
                                        it
                                    })
                                    it
                                })
                                it
                            }
                            it
                        })
                        it
                    }
            )
            data << new DataField(
                    method: 'setupUIInfo',
                    description: 'remove description',
                    representation: new EntityDescriptorRepresentation().with {
                        it.mdui = new MduiRepresentation().with {
                            it
                        }
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor).with {
                        it.roleDescriptors.add(openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor).with {
                            it.extensions = openSAMLObjects.buildDefaultInstanceOfType(Extensions).with {
                                it.unknownXMLObjects.add(openSAMLObjects.buildDefaultInstanceOfType(UIInfo).with {
                                    it.XMLObjects.add(openSAMLObjects.buildDefaultInstanceOfType(Description).with {
                                        it.value = 'test description'
                                        it.XMLLang = 'en'
                                        it
                                    })
                                    it
                                })
                                it
                            }
                            it
                        })
                        it
                    },
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor).with {
                        it.roleDescriptors.add(openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor).with {
                            it.extensions = openSAMLObjects.buildDefaultInstanceOfType(Extensions).with {
                                it
                            }
                            it
                        })
                        it
                    }
            )
            data << new DataField(
                    method: 'setupUIInfo',
                    description: 'set logo',
                    representation: new EntityDescriptorRepresentation().with {
                        it.mdui = new MduiRepresentation().with {
                            it.logoUrl = 'http://test'
                            it.logoHeight = 5
                            it.logoWidth = 25
                            it
                        }
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor),
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor).with {
                        it.roleDescriptors.add(openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor).with {
                            it.extensions = openSAMLObjects.buildDefaultInstanceOfType(Extensions).with {
                                it.unknownXMLObjects.add(openSAMLObjects.buildDefaultInstanceOfType(UIInfo).with {
                                    it.XMLObjects.add(openSAMLObjects.buildDefaultInstanceOfType(Logo).with {
                                        it.uri = 'http://test'
                                        it.height = 5
                                        it.width = 25
                                        it.XMLLang = 'en'
                                        it
                                    })
                                    it
                                })
                                it
                            }
                            it
                        })
                        it
                    }
            )
            data << new DataField(
                    method: 'setupUIInfo',
                    description: 'remove logo',
                    representation: new EntityDescriptorRepresentation().with {
                        it.mdui = new MduiRepresentation().with {
                            it
                        }
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor).with {
                        it.roleDescriptors.add(openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor).with {
                            it.extensions = openSAMLObjects.buildDefaultInstanceOfType(Extensions).with {
                                it.unknownXMLObjects.add(openSAMLObjects.buildDefaultInstanceOfType(UIInfo).with {
                                    it.XMLObjects.add(openSAMLObjects.buildDefaultInstanceOfType(Logo).with {
                                        it.uri = 'http://test'
                                        it.height = 5
                                        it.width = 25
                                        it.XMLLang = 'en'
                                        it
                                    })
                                    it
                                })
                                it
                            }
                            it
                        })
                        it
                    },
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor).with {
                        it.roleDescriptors.add(openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor).with {
                            it.extensions = openSAMLObjects.buildDefaultInstanceOfType(Extensions).with {
                                it
                            }
                            it
                        })
                        it
                    }
            )
            data << new DataField(
                    method: 'setupUIInfo',
                    description: 'remove ui info',
                    representation: new EntityDescriptorRepresentation().with {
                        it.serviceProviderSsoDescriptor = new ServiceProviderSsoDescriptorRepresentation()
                        it
                    },
                    starter: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor).with {
                        it.roleDescriptors.add(openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor).with {
                            it.extensions = openSAMLObjects.buildDefaultInstanceOfType(Extensions).with {
                                it.unknownXMLObjects.add(openSAMLObjects.buildDefaultInstanceOfType(UIInfo).with {
                                    it.XMLObjects.add(openSAMLObjects.buildDefaultInstanceOfType(Logo).with {
                                        it.uri = 'http://test'
                                        it.height = 5
                                        it.width = 25
                                        it.XMLLang = 'en'
                                        it
                                    })
                                    it
                                })
                                it
                            }
                            it
                        })
                        it
                    },
                    expected: openSAMLObjects.buildDefaultInstanceOfType(EntityDescriptor).with {
                        it.roleDescriptors.add(openSAMLObjects.buildDefaultInstanceOfType(SPSSODescriptor).with {
                            it.extensions = openSAMLObjects.buildDefaultInstanceOfType(Extensions)
                            it
                        })
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