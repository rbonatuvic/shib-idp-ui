package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.SPSSODescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.SingleLogoutService
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.LogoutEndpointRepresentation
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
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
        [method, description, representation, starter, expected]  << Data.getData(openSAMLObjects)
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
