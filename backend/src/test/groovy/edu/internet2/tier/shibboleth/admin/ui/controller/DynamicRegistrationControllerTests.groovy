package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.service.DynamicRegistrationService
import edu.internet2.tier.shibboleth.admin.ui.service.EntityService
import edu.internet2.tier.shibboleth.admin.ui.util.WithMockAdmin
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.transaction.annotation.Transactional
import spock.lang.Subject

import javax.persistence.EntityManager

import static org.springframework.http.MediaType.APPLICATION_JSON
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class DynamicRegistrationControllerTests extends AbstractBaseDataJpaTest {
    @Autowired
    DynamicRegistrationService dynamicRegistrationService;

    @Autowired
    EntityManager entityManager

    @Autowired
    EntityService entityService

    @Autowired
    ObjectMapper mapper

    def mockMvc

    @Subject
    def controller

    @Transactional
    def setup() {
        Group gb = new Group()
        gb.setResourceId("testingGroupBBB")
        gb.setName("Group BBB")
        gb.setValidationRegex("^(?:https?:\\/\\/)?(?:[^.]+\\.)?shib\\.org(\\/.*)?\$")
        gb = groupService.createGroup(gb)

        controller = new DynamicRegistrationController()
        controller.dynamicRegistrationService = dynamicRegistrationService
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build()

        Optional<Role> userRole = roleRepository.findByName("ROLE_USER")
        User user = new User(username: "someUser", roles:[userRole.get()], password: "foo")
        user.setGroup(gb)
        userService.save(user)
    }

//    @WithMockAdmin
//    def 'DELETE as admin'() {
//        given:
//        def entityDescriptor = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: false)
//        entityDescriptorRepository.save(entityDescriptor)
//
//        when: 'pre-check'
//        entityManager.flush()
//
//        then:
//        entityDescriptorRepository.findAll().size() == 1
//
//        when:
//        def result = mockMvc.perform(delete("/api/EntityDescriptor/uuid-1"))
//
//        then:
//        result.andExpect(status().isNoContent())
//        entityDescriptorRepository.findByResourceId("uuid-1") == null
//        entityDescriptorRepository.findAll().size() == 0
//    }
//
//    @WithMockUser(value = "someUser", roles = ["USER"])
//    def 'DELETE as non-admin'() {
//        given:
//        def entityDescriptor = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: false)
//        entityDescriptorRepository.save(entityDescriptor)
//
//        when: 'pre-check'
//        entityManager.flush()
//
//        then:
//        entityDescriptorRepository.findAll().size() == 1
//        try {
//            result = mockMvc.perform(delete("/api/EntityDescriptor/uuid-1"))
//        }
//        catch (Exception e) {
//            e instanceof ForbiddenException
//        }
//    }
//
    @WithMockAdmin
    def 'GET /DynamicRegistrations with empty repository as admin'() {
        when:
        def result = mockMvc.perform(get('/api/DynamicRegistrations'))

        then:
        result.andExpect(status().isOk()).andExpect(content().contentType(APPLICATION_JSON)).andExpect(content().json('[]'))
    }
//
//    @WithMockAdmin
//    def 'GET /EntityDescriptors with 1 record in repository as admin'() {
//        given:
//        def entityDescriptor = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true, idOfOwner: "admingroup")
//        entityDescriptorRepository.saveAndFlush(entityDescriptor)
//
//        def expectedResponseContentType = APPLICATION_JSON
//        def expectedHttpResponseStatus = status().isOk()
//
//        when:
//        def result = mockMvc.perform(get('/api/EntityDescriptors'))
//
//        then:
//        result.andDo(MockMvcResultHandlers.print())
//              .andExpect(expectedHttpResponseStatus).andExpect(content().contentType(expectedResponseContentType))
//              .andExpect(jsonPath("\$.[0].id").value("uuid-1"))
//              .andExpect(jsonPath("\$.[0].entityId").value("eid1"))
//              .andExpect(jsonPath("\$.[0].serviceEnabled").value(true))
//              .andExpect(jsonPath("\$.[0].idOfOwner").value("admingroup"))
//              .andExpect(jsonPath("\$.[0].protocol").value("SAML"))
//    }
//
//    @WithMockAdmin
//    def 'GET /EntityDescriptors with 2 records in repository as admin'() {
//        given:
//        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true, idOfOwner: "admingroup")
//        def entityDescriptorTwo = new EntityDescriptor(resourceId: 'uuid-2', entityID: 'eid2', serviceProviderName: 'sp2', serviceEnabled: false, idOfOwner: "admingroup")
//
//        entityDescriptorRepository.saveAndFlush(entityDescriptorOne)
//        entityDescriptorRepository.saveAndFlush(entityDescriptorTwo)
//
//        def expectedResponseContentType = APPLICATION_JSON
//        def expectedHttpResponseStatus = status().isOk()
//
//        when:
//        def result = mockMvc.perform(get('/api/EntityDescriptors'))
//
//        then:
//        result.andExpect(expectedHttpResponseStatus)
//              .andExpect(content().contentType(expectedResponseContentType))
//              .andExpect(jsonPath("\$.[0].id").value("uuid-1"))
//              .andExpect(jsonPath("\$.[0].entityId").value("eid1"))
//              .andExpect(jsonPath("\$.[0].serviceEnabled").value(true))
//              .andExpect(jsonPath("\$.[0].idOfOwner").value("admingroup"))
//              .andExpect(jsonPath("\$.[0].protocol").value("SAML"))
//              .andExpect(jsonPath("\$.[1].id").value("uuid-2"))
//              .andExpect(jsonPath("\$.[1].entityId").value("eid2"))
//              .andExpect(jsonPath("\$.[1].serviceEnabled").value(false))
//              .andExpect(jsonPath("\$.[1].idOfOwner").value("admingroup"))
//              .andExpect(jsonPath("\$.[1].protocol").value("SAML"))
//    }
//
//    @WithMockUser(value = "someUser", roles = ["USER"])
//    def 'POST create new - entity id does not match pattern'() {
//        when:
//        def expectedEntityId = 'https://google.com/blah/blah'
//        EntityDescriptorRepresentation edRep = new EntityDescriptorRepresentation()
//        edRep.setEntityId(expectedEntityId)
//        edRep.setServiceProviderName("spName")
//
//        def edRepJson = mapper.writeValueAsString(edRep)
//
//        then:
//        try {
//            mockMvc.perform(post('/api/EntityDescriptor').contentType(APPLICATION_JSON).content(edRepJson))
//            false
//        } catch (NestedServletException expected) {
//            expected.getCause() instanceof InvalidPatternMatchException
//        }
//    }
//
//    @WithMockUser(value = "someUser", roles = ["USER"])
//    def 'POST create new - verifying validation on entityID and ACS locations'() {
//        given:
//        def expectedEntityId = 'https://shib.org/blah/blah'
//        EntityDescriptorRepresentation edRep = new EntityDescriptorRepresentation()
//        edRep.setEntityId(expectedEntityId)
//        edRep.setServiceProviderName("spName")
//
//        def acsList = new ArrayList<AssertionConsumerServiceRepresentation>()
//        AssertionConsumerServiceRepresentation acsRep = new AssertionConsumerServiceRepresentation()
//        acsRep.setIndex(0)
//        acsRep.setLocationUrl("http://logout.shib.org/dologout")
//        acsList.add(acsRep)
//        edRep.setAssertionConsumerServices(acsList)
//
//        def edRepJson = mapper.writeValueAsString(edRep)
//
//        when:
//        def result = mockMvc.perform(post('/api/EntityDescriptor').contentType(APPLICATION_JSON).content(edRepJson))
//
//        then:
//        result.andExpect(status().isCreated())
//                .andExpect(content().contentType(APPLICATION_JSON))
//                .andExpect(jsonPath("\$.entityId").value("https://shib.org/blah/blah"))
//                .andExpect(jsonPath("\$.serviceEnabled").value(false))
//                .andExpect(jsonPath("\$.idOfOwner").value("testingGroupBBB"))
//
//        when: "ACS url is bad"
//        expectedEntityId = 'https://shib.org/blah/blah/again'
//        edRep = new EntityDescriptorRepresentation()
//        edRep.setEntityId(expectedEntityId)
//        edRep.setServiceProviderName("spName")
//
//        acsList = new ArrayList<AssertionConsumerServiceRepresentation>()
//        acsRep = new AssertionConsumerServiceRepresentation()
//        acsRep.setIndex(0)
//        acsRep.setLocationUrl("http://shib.com/dologout")
//        acsList.add(acsRep)
//        edRep.setAssertionConsumerServices(acsList)
//        edRepJson = mapper.writeValueAsString(edRep)
//
//        then:
//        try {
//            mockMvc.perform(post('/api/EntityDescriptor').contentType(APPLICATION_JSON).content(edRepJson))
//            false
//        } catch (NestedServletException expected) {
//            expected.getCause() instanceof InvalidPatternMatchException
//        }
//    }
//
//    @WithMockAdmin
//    def 'POST /EntityDescriptor and successfully create new record'() {
//        given:
//        def expectedEntityId = 'https://shib'
//        def expectedSpName = 'sp1'
//        def expectedResponseHeader = 'Location'
//        def expectedResponseHeaderValue = "/api/EntityDescriptor/"
//
//        def postedJsonBody = """
//              {
//	            "serviceProviderName": "$expectedSpName",
//	            "entityId": "$expectedEntityId",
//	            "organization": {},
//	            "serviceEnabled": true,
//	            "createdDate": null,
//                "modifiedDate": null,
//	            "contacts": null,
//	            "serviceProviderSsoDescriptor": null,
//	            "logoutEndpoints": null,
//	            "securityInfo": null,
//	            "assertionConsumerServices": null,
//                "current": false
//              }
//        """
//
//        when:
//        def result = mockMvc.perform(post('/api/EntityDescriptor').contentType(APPLICATION_JSON).content(postedJsonBody))
//
//        then:
//        result.andExpect(status().isCreated())
//              .andExpect(header().string(expectedResponseHeader, containsString(expectedResponseHeaderValue)))
//              .andExpect(jsonPath("\$.entityId").value("https://shib"))
//              .andExpect(jsonPath("\$.serviceEnabled").value(true))
//              .andExpect(jsonPath("\$.idOfOwner").value("admingroup"))
//    }
//
//    @WithMockUser(value = "someUser", roles = ["USER"])
//    def 'POST /EntityDescriptor as user disallows enabling'() {
//        given:
//        def expectedEntityId = 'https://shib'
//        def expectedSpName = 'sp1'
//
//        when:
//        def postedJsonBody = """
//              {
//                "serviceProviderName": "$expectedSpName",
//                "entityId": "$expectedEntityId",
//                "organization": null,
//                "serviceEnabled": true,
//                "createdDate": null,
//                "modifiedDate": null,
//                "organization": null,
//                "contacts": null,
//                "mdui": null,
//                "serviceProviderSsoDescriptor": null,
//                "logoutEndpoints": null,
//                "securityInfo": null,
//                "assertionConsumerServices": null,
//                "relyingPartyOverrides": null,
//                "attributeRelease": null
//              }
//        """
//
//        then:
//        try {
//            mockMvc.perform(post('/api/EntityDescriptor').contentType(APPLICATION_JSON).content(postedJsonBody))
//        }
//        catch (Exception e) {
//            e instanceof ForbiddenException
//        }
//    }
//
//    @WithMockAdmin
//    def 'POST /EntityDescriptor record already exists'() {
//        given:
//        def postedJsonBody = """
//              {
//	            "serviceProviderName": "sp1",
//	            "entityId": "eid1",
//	            "organization": null,
//	            "serviceEnabled": true,
//	            "createdDate": null,
//                "modifiedDate": null,
//	            "organization": null,
//	            "contacts": null,
//	            "mdui": null,
//	            "serviceProviderSsoDescriptor": null,
//	            "logoutEndpoints": null,
//	            "securityInfo": null,
//	            "assertionConsumerServices": null,
//	            "relyingPartyOverrides": null,
//                "attributeRelease": null
//              }
//        """
//
//        when:
//        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true)
//        def entityDescriptorTwo = new EntityDescriptor(resourceId: 'uuid-2', entityID: 'eid2', serviceProviderName: 'sp2', serviceEnabled: false)
//
//        entityDescriptorRepository.save(entityDescriptorOne)
//        entityDescriptorRepository.save(entityDescriptorTwo)
//        entityManager.flush()
//
//        then:
//        try {
//            mockMvc.perform(post('/api/EntityDescriptor').contentType(APPLICATION_JSON).content(postedJsonBody))
//        }
//        catch (Exception e) {
//            e instanceof ObjectIdExistsException
//        }
//    }
//
//    @WithMockAdmin
//    def 'GET /EntityDescriptor/{resourceId} non-existent'() {
//        expect:
//        try {
//            mockMvc.perform(get("/api/EntityDescriptor/uuid-1"))
//        }
//        catch (Exception e) {
//            e instanceof PersistentEntityNotFound
//        }
//    }
//
//    @WithMockAdmin
//    def 'GET /EntityDescriptor/{resourceId} existing'() {
//        given:
//        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true, idOfOwner: "admingroup")
//        entityDescriptorRepository.save(entityDescriptorOne)
//        entityManager.flush()
//
//        when:
//        def result = mockMvc.perform(get("/api/EntityDescriptor/uuid-1"))
//
//        then:
//        result.andExpect(status().isOk())
//              .andExpect(jsonPath("\$.entityId").value("eid1"))
//              .andExpect(jsonPath("\$.serviceProviderName").value("sp1"))
//              .andExpect(jsonPath("\$.serviceEnabled").value(true))
//              .andExpect(jsonPath("\$.idOfOwner").value("admingroup"))
//    }
//
//    @WithMockUser(value = "someUser", roles = ["USER"])
//    def 'GET /EntityDescriptor/{resourceId} existing, validate group access'() {
//        given:
//        Group g = userService.getCurrentUserGroup()
//
//        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true, idOfOwner: "someUser")
//        def entityDescriptorTwo = new EntityDescriptor(resourceId: 'uuid-2', entityID: 'eid2', serviceProviderName: 'sp2', serviceEnabled: false, idOfOwner: Group.ADMIN_GROUP.getOwnerId())
//
//        entityDescriptorRepository.saveAndFlush(entityDescriptorOne)
//        entityDescriptorRepository.saveAndFlush(entityDescriptorTwo)
//
//        ownershipRepository.saveAndFlush(new Ownership(g, entityDescriptorOne))
//        ownershipRepository.saveAndFlush(new Ownership(Group.ADMIN_GROUP, entityDescriptorTwo))
//
//        when:
//        def result = mockMvc.perform(get("/api/EntityDescriptor/uuid-1"))
//
//        then:
//        result.andExpect(status().isOk())
//              .andExpect(jsonPath("\$.entityId").value("eid1"))
//              .andExpect(jsonPath("\$.serviceProviderName").value("sp1"))
//              .andExpect(jsonPath("\$.serviceEnabled").value(true))
//              .andExpect(jsonPath("\$.idOfOwner").value("someUser"))
//    }
//
//    @WithMockUser(value = "someUser", roles = ["USER"])
//    def 'GET /EntityDescriptor/{resourceId} existing, owned by some other user'() {
//        when:
//        Group g = userService.getCurrentUserGroup()
//
//        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true, idOfOwner: g.getOwnerId())
//        def entityDescriptorTwo = new EntityDescriptor(resourceId: 'uuid-2', entityID: 'eid2', serviceProviderName: 'sp2', serviceEnabled: false, idOfOwner: Group.ADMIN_GROUP.getOwnerId())
//
//        entityDescriptorRepository.saveAndFlush(entityDescriptorOne)
//        entityDescriptorRepository.saveAndFlush(entityDescriptorTwo)
//
//        ownershipRepository.saveAndFlush(new Ownership(g, entityDescriptorOne))
//        ownershipRepository.saveAndFlush(new Ownership(Group.ADMIN_GROUP, entityDescriptorTwo))
//
//        then:
//        try {
//            mockMvc.perform(get("/api/EntityDescriptor/uuid-2"))
//        }
//        catch (Exception e) {
//            e instanceof ForbiddenException
//        }
//    }
//
//    @WithMockAdmin
//    def 'GET /EntityDescriptor/{resourceId} existing (xml)'() {
//        given:
//        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true)
//        entityDescriptorOne.setElementLocalName("EntityDescriptor")
//        entityDescriptorOne.setNamespacePrefix("md")
//        entityDescriptorOne.setNamespaceURI("urn:oasis:names:tc:SAML:2.0:metadata")
//        entityDescriptorRepository.save(entityDescriptorOne)
//        entityManager.flush()
//
//        def expectedXML = """<?xml version="1.0" encoding="UTF-8"?>
//<md:EntityDescriptor
//	xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="eid1"/>"""
//
//        when:
//        def result = mockMvc.perform(get("/api/EntityDescriptor/uuid-1").accept(APPLICATION_XML))
//
//        then:
//        result.andExpect(status().isOk()).andExpect(content().xml(expectedXML))
//    }
//
//    @WithMockUser(value = "someUser", roles = ["USER"])
//    def 'GET /EntityDescriptor/{resourceId} existing (xml), user-owned'() {
//        given:
//        Group g = userService.getCurrentUserGroup()
//
//        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true, idOfOwner: g.getOwnerId())
//        entityDescriptorOne.setElementLocalName("EntityDescriptor")
//        entityDescriptorOne.setNamespacePrefix("md")
//        entityDescriptorOne.setNamespaceURI("urn:oasis:names:tc:SAML:2.0:metadata")
//        entityDescriptorOne = entityDescriptorRepository.saveAndFlush(entityDescriptorOne)
//        ownershipRepository.saveAndFlush(new Ownership(g,entityDescriptorOne))
//
//        def expectedXML = """<?xml version="1.0" encoding="UTF-8"?>
//<md:EntityDescriptor
//    xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="eid1"/>"""
//
//        when:
//        def result = mockMvc.perform(get("/api/EntityDescriptor/uuid-1").accept(APPLICATION_XML))
//
//        then:
//        result.andExpect(status().isOk()).andExpect(content().xml(expectedXML))
//    }
//
//    @WithMockUser(value = "someUser", roles = ["USER"])
//    def 'GET /EntityDescriptor/{resourceId} existing (xml), other user-owned'() {
//        when:
//        Group g = Group.ADMIN_GROUP
//
//        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true, idOfOwner: g.getOwnerId())
//        entityDescriptorOne.setElementLocalName("EntityDescriptor")
//        entityDescriptorOne.setNamespacePrefix("md")
//        entityDescriptorOne.setNamespaceURI("urn:oasis:names:tc:SAML:2.0:metadata")
//        entityDescriptorRepository.save(entityDescriptorOne)
//        entityManager.flush()
//
//        then:
//        try {
//            mockMvc.perform(get("/api/EntityDescriptor/$providedResourceId").accept(APPLICATION_XML))
//        }
//        catch (Exception e) {
//            e instanceof ForbiddenException
//        }
//    }
//
//    @WithMockAdmin
//    def "POST /EntityDescriptor handles XML happily"() {
//        given:
//        def postedBody = '''<?xml version="1.0" encoding="UTF-8"?>
//<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="http://test.scaldingspoon.org/test1">
//  <md:Extensions>
//    <mdattr:EntityAttributes xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute">
//      <saml:Attribute xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" Name="http://scaldingspoon.org/realm" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri">
//        <saml:AttributeValue>internal</saml:AttributeValue>
//      </saml:Attribute>
//      <saml:Attribute xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" Name="http://shibboleth.net/ns/attributes/releaseAllValues" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri">
//        <saml:AttributeValue>givenName</saml:AttributeValue>
//        <saml:AttributeValue>employeeNumber</saml:AttributeValue>
//      </saml:Attribute>
//    </mdattr:EntityAttributes>
//  </md:Extensions>
//  <md:SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
//    <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</md:NameIDFormat>
//    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://test.scaldingspoon.org/test1/acs" index="1"/>
//    <md:AttributeConsumingService index="1">
//         <md:ServiceName xml:lang="en">Shrink Space</md:ServiceName>
//         <md:ServiceDescription xml:lang="en">Shrink Space Authenticator</md:ServiceDescription>
//         <md:RequestedAttribute FriendlyName="givenName" Name="urn:oid:2.5.4.42" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri" isRequired="true"/>
//   </md:AttributeConsumingService>
//  </md:SPSSODescriptor>
//</md:EntityDescriptor>
//'''
//        def expectedResponseHeader = 'Location'
//        def expectedResponseHeaderValue = "/api/EntityDescriptor/"
//
//        when:
//        def spName = randomGenerator.randomString()
//        def result = mockMvc.perform(post("/api/EntityDescriptor").contentType(APPLICATION_XML).content(postedBody).param("spName", spName))
//
//        then:
//        result.andExpect(status().isCreated())
//              .andExpect(header().string(expectedResponseHeader, containsString(expectedResponseHeaderValue)))
//              .andExpect(jsonPath("\$.entityId").value("http://test.scaldingspoon.org/test1"))
//              .andExpect(jsonPath("\$.serviceEnabled").value(false))
//              .andExpect(jsonPath("\$.idOfOwner").value("admingroup"))
//              .andExpect(jsonPath("\$.serviceProviderSsoDescriptor.protocolSupportEnum").value("SAML 2"))
//              .andExpect(jsonPath("\$.serviceProviderSsoDescriptor.nameIdFormats[0]").value("urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified"))
//              .andExpect(jsonPath("\$.assertionConsumerServices[0].binding").value("urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"))
//              .andExpect(jsonPath("\$.assertionConsumerServices[0].makeDefault").value(false))
//              .andExpect(jsonPath("\$.assertionConsumerServices[0].locationUrl").value("https://test.scaldingspoon.org/test1/acs"))
//
//        try {
//            mockMvc.perform(post("/api/EntityDescriptor").contentType(APPLICATION_XML).content(postedBody).param("spName", spName))
//        }
//        catch (Exception e) {
//            e instanceof ObjectIdExistsException
//        }
//    }
//
//    @WithMockAdmin
//    def "POST /EntityDescriptor returns error for duplicate entity id"() {
//        when:
//        def postedBody = '''<?xml version="1.0" encoding="UTF-8"?>
//<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="http://test.scaldingspoon.org/test1">
//  <md:Extensions>
//    <mdattr:EntityAttributes xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute">
//      <saml:Attribute xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" Name="http://scaldingspoon.org/realm" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri">
//        <saml:AttributeValue>internal</saml:AttributeValue>
//      </saml:Attribute>
//      <saml:Attribute xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" Name="http://shibboleth.net/ns/attributes/releaseAllValues" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri">
//        <saml:AttributeValue>givenName</saml:AttributeValue>
//        <saml:AttributeValue>employeeNumber</saml:AttributeValue>
//      </saml:Attribute>
//    </mdattr:EntityAttributes>
//  </md:Extensions>
//  <md:SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
//    <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</md:NameIDFormat>
//    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://test.scaldingspoon.org/test1/acs" index="1"/>
//  </md:SPSSODescriptor>
//</md:EntityDescriptor>
//'''
//        def spName = randomGenerator.randomString()
//        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true)
//        def entityDescriptorTwo = new EntityDescriptor(resourceId: 'uuid-2', entityID: 'http://test.scaldingspoon.org/test1', serviceProviderName: 'sp2', serviceEnabled: false)
//
//        entityDescriptorRepository.save(entityDescriptorOne)
//        entityDescriptorRepository.save(entityDescriptorTwo)
//        entityManager.flush()
//
//        then:
//        try {
//            mockMvc.perform(post("/api/EntityDescriptor").contentType(APPLICATION_XML).content(postedBody).param("spName", spName))
//        }
//        catch (Exception e) {
//            e instanceof ObjectIdExistsException
//        }
//    }
//
//    @WithMockAdmin
//    def "PUT /EntityDescriptor updates entity descriptors properly as admin"() {
//        given:
//        def entityDescriptorToSave = new EntityDescriptor(resourceId: 'uuid-2', entityID: 'eid2', serviceProviderName: 'sp2', serviceEnabled: false, idOfOwner: Group.ADMIN_GROUP.getOwnerId())
//
//        entityDescriptorRepository.save(entityDescriptorToSave)
//        entityManager.flush()
//        entityManager.clear()
//
//        def entityDescriptorTwo = entityDescriptorRepository.findByResourceId('uuid-2')
//
//        def updatedEntityDescriptorRepresentation = jpaEntityDescriptorService.createRepresentationFromDescriptor(entityDescriptorTwo)
//        updatedEntityDescriptorRepresentation.setServiceProviderName("newName")
//        def postedJsonBody = mapper.writeValueAsString(updatedEntityDescriptorRepresentation)
//
//        when:
//        def result = mockMvc.perform(put("/api/EntityDescriptor/uuid-2").contentType(APPLICATION_JSON).content(postedJsonBody))
//
//        then:
//        result.andExpect(status().isOk())
//              .andExpect(jsonPath("\$.entityId").value("eid2"))
//              .andExpect(jsonPath("\$.serviceEnabled").value(false))
//              .andExpect(jsonPath("\$.idOfOwner").value("admingroup"))
//              .andExpect(jsonPath("\$.serviceProviderName").value("newName"))
//    }
//
//    @WithMockUser(value = "someUser", roles = ["USER"])
//    def "PUT /EntityDescriptor disallows non-admin user from enabling"() {
//        given:
//        Group g = userService.getCurrentUserGroup()
//
//        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: false, idOfOwner: g.getOwnerId())
//        entityDescriptorOne = entityDescriptorRepository.save(entityDescriptorOne)
//        entityManager.flush()
//
//        when:
//        entityDescriptorOne.serviceEnabled = true
//        entityDescriptorOne.resourceId = 'uuid-1'
//        def updatedEntityDescriptorRepresentation = jpaEntityDescriptorService.createRepresentationFromDescriptor(entityDescriptorOne)
//        updatedEntityDescriptorRepresentation.version = entityDescriptorOne.hashCode()
//        def postedJsonBody = mapper.writeValueAsString(updatedEntityDescriptorRepresentation)
//
//        then:
//        try {
//            mockMvc.perform(put("/api/EntityDescriptor/uuid-1").contentType(APPLICATION_JSON).content(postedJsonBody))
//        }
//        catch (Exception e) {
//            e instanceof ForbiddenException
//        }
//    }
//
//    @WithMockUser(value = "someUser", roles = ["USER"])
//    def "PUT /EntityDescriptor denies the request if the PUTing user is not an ADMIN and not the createdBy user"() {
//        given:
//        Group g = userService.getCurrentUserGroup()
//
//        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true, idOfOwner: g.getOwnerId())
//        entityDescriptorOne = entityDescriptorRepository.save(entityDescriptorOne)
//        entityManager.flush()
//
//        when:
//        entityDescriptorOne.serviceProviderName = 'foo'
//        entityDescriptorOne.resourceId = 'uuid-1'
//        def updatedEntityDescriptorRepresentation = jpaEntityDescriptorService.createRepresentationFromDescriptor(entityDescriptorOne)
//        updatedEntityDescriptorRepresentation.version = entityDescriptorOne.hashCode()
//        def postedJsonBody = mapper.writeValueAsString(updatedEntityDescriptorRepresentation)
//
//        then:
//        try {
//            mockMvc.perform(put("/api/EntityDescriptor/uuid-1").contentType(APPLICATION_JSON).content(postedJsonBody))
//        }
//        catch (Exception e) {
//            e instanceof ForbiddenException
//        }
//    }
//
//    @WithMockAdmin
//    def "PUT /EntityDescriptor throws a concurrent mod exception if the version numbers don't match"() {
//        given:
//        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true, idOfOwner: Group.ADMIN_GROUP.getOwnerId())
//        entityDescriptorOne = entityDescriptorRepository.save(entityDescriptorOne)
//        entityManager.flush()
//
//        when:
//        entityDescriptorOne.serviceProviderName = 'foo'
//        entityDescriptorOne.resourceId = 'uuid-1'
//        def updatedEntityDescriptorRepresentation = jpaEntityDescriptorService.createRepresentationFromDescriptor(entityDescriptorOne)
//
//        def postedJsonBody = mapper.writeValueAsString(updatedEntityDescriptorRepresentation)
//
//        then:
//        try {
//            mockMvc.perform(put("/api/EntityDescriptor/$resourceId").contentType(APPLICATION_JSON).content(postedJsonBody))
//        }
//        catch (Exception e) {
//            e instanceof ConcurrentModificationException
//        }
//    }
//
//    @WithMockAdmin
//    def "POST /EntityDescriptor OIDC descriptor - incoming JSON"() {
//        when:
//        def result = mockMvc.perform(post('/api/EntityDescriptor').contentType(APPLICATION_JSON).content(fromFile("/json/SHIBUI-2380-1.json")))
//
//        then:
//        result.andExpect(status().isCreated())
//            .andExpect(content().contentType(APPLICATION_JSON))
//            .andExpect(jsonPath("\$.entityId").value("mockSamlClientId2"))
//            .andExpect(jsonPath("\$.serviceEnabled").value(false))
//            .andExpect(jsonPath("\$.idOfOwner").value("admingroup"))
//            .andExpect(jsonPath("\$.serviceProviderSsoDescriptor.protocolSupportEnum").value("http://openid.net/specs/openid-connect-core-1_0.html"))
//            .andExpect(jsonPath("\$.securityInfo.keyDescriptors[0].name").value("test1"))
//            .andExpect(jsonPath(shortNameToOAuth + "attributes.clientUri").value("https://example.org/clientUri"))
//            .andExpect(jsonPath(shortNameToOAuth + "attributes.responseTypes").value("code id_token"))
//            .andExpect(jsonPath(shortNameToOAuth + "attributes.sectorIdentifierUri").value("https://example.org/sectorIdentifier"))
//            .andExpect(jsonPath(shortNameToOAuth + "attributes.idTokenEncryptedResponseEnc").value("A256GCM"))
//            .andExpect(jsonPath(shortNameToOAuth + "attributes.applicationType").value("web"))
//            .andExpect(jsonPath(shortNameToOAuth + "attributes.tokenEndpointAuthMethod").value("client_secret_basic"))
//            .andExpect(jsonPath(shortNameToOAuth + "attributes.userInfoEncryptedResponseEnc").value("A192GCM"))
//            .andExpect(jsonPath(shortNameToOAuth + "attributes.userInfoSignedResponseAlg").value("RS384"))
//            .andExpect(jsonPath(shortNameToOAuth + "attributes.userInfoEncryptedResponseAlg").value("A192KW"))
//            .andExpect(jsonPath(shortNameToOAuth + "attributes.grantTypes").value("authorization_code"))
//            .andExpect(jsonPath(shortNameToOAuth + "attributes.softwareId").value("mockSoftwareId"))
//            .andExpect(jsonPath(shortNameToOAuth + "attributes.requestObjectEncryptionEnc").value("A128GCM"))
//            .andExpect(jsonPath(shortNameToOAuth + "attributes.initiateLoginUri").value("https://example.org/initiateLogin"))
//            .andExpect(jsonPath(shortNameToOAuth + "attributes.tokenEndpointAuthMethod").value("client_secret_basic"))
//            .andExpect(jsonPath(shortNameToOAuth + "attributes.requestObjectSigningAlg").value("RS256"))
//            .andExpect(jsonPath(shortNameToOAuth + "attributes.scopes").value("openid profile"))
//            .andExpect(jsonPath(shortNameToOAuth + "attributes.idTokenEncryptedResponseAlg").value("A256KW"))
//            .andExpect(jsonPath(shortNameToOAuth + "attributes.softwareVersion").value("mockSoftwareVersion"))
//            .andExpect(jsonPath(shortNameToOAuth + "postLogoutRedirectUris[0]").value("https://example.org/postLogout"))
//            .andExpect(jsonPath(shortNameToOAuth + "requestUris[0]").value("https://example.org/request"))
//            .andExpect(jsonPath(shortNameToOAuth + "defaultAcrValues").isArray())
//            .andExpect(jsonPath(shortNameToOAuth + "attributes.requireAuthTime").value(Boolean.FALSE))
//            .andExpect(jsonPath(shortNameToOAuth + "attributes.defaultMaxAge").value(Integer.valueOf(0)))
//    }
//
//    @WithMockAdmin
//    def 'GET /EntityDescriptor/{resourceId} existing as oidc xml'() {
//        given:
//        def representation = new ObjectMapper().readValue(this.class.getResource('/json/SHIBUI-2380.json').bytes, EntityDescriptorRepresentation)
//        jpaEntityDescriptorService.createNew(representation)
//        def edResourceId = jpaEntityDescriptorService.getAllEntityDescriptorProjectionsBasedOnUserAccess().get(0).getResourceId()
//
//        when:
//        def result = mockMvc.perform(get("/api/EntityDescriptor/" + edResourceId).accept(APPLICATION_XML))
//
//        then:
//        String xmlContent = result.andReturn().getResponse().getContentAsString();
//        result.andExpect(status().isOk())
//        TestHelpers.generatedXmlIsTheSameAsExpectedXml(new String(fromFile("/metadata/SHIBUI-2380.xml"), StandardCharsets.UTF_8), xmlContent)
//    }
//
//    @WithMockAdmin
//    def "POST /EntityDescriptor OIDC descriptor - incoming XML"() {
//        when:
//        def result = mockMvc.perform(post('/api/EntityDescriptor').contentType(APPLICATION_XML).content(fromFile("/metadata/SHIBUI-2380.xml")).param("spName", "testing"))
//
//        then:
//        result.andExpect(status().isCreated())
//                .andExpect(content().contentType(APPLICATION_JSON))
//                .andExpect(jsonPath("\$.entityId").value("mockSamlClientId"))
//                .andExpect(jsonPath("\$.serviceProviderSsoDescriptor.protocolSupportEnum").value("http://openid.net/specs/openid-connect-core-1_0.html"))
//                .andExpect(jsonPath("\$.protocol").value("OIDC"))
//                .andExpect(jsonPath("\$.serviceEnabled").value(false))
//                .andExpect(jsonPath("\$.idOfOwner").value("admingroup"))
//                .andExpect(jsonPath("\$.securityInfo.keyDescriptors[0].name").value("test1"))
//                .andExpect(jsonPath(shortNameToOAuth + "attributes.clientUri").value("https://example.org/clientUri"))
//                .andExpect(jsonPath(shortNameToOAuth + "attributes.responseTypes").value("code id_token"))
//                .andExpect(jsonPath(shortNameToOAuth + "attributes.sectorIdentifierUri").value("https://example.org/sectorIdentifier"))
//                .andExpect(jsonPath(shortNameToOAuth + "attributes.idTokenEncryptedResponseEnc").value("A256GCM"))
//                .andExpect(jsonPath(shortNameToOAuth + "attributes.applicationType").value("web"))
//                .andExpect(jsonPath(shortNameToOAuth + "attributes.tokenEndpointAuthMethod").value("client_secret_basic"))
//                .andExpect(jsonPath(shortNameToOAuth + "attributes.userInfoEncryptedResponseEnc").value("A192GCM"))
//                .andExpect(jsonPath(shortNameToOAuth + "attributes.userInfoSignedResponseAlg").value("RS384"))
//                .andExpect(jsonPath(shortNameToOAuth + "attributes.userInfoEncryptedResponseAlg").value("A192KW"))
//                .andExpect(jsonPath(shortNameToOAuth + "attributes.grantTypes").value("authorization_code"))
//                .andExpect(jsonPath(shortNameToOAuth + "attributes.softwareId").value("mockSoftwareId"))
//                .andExpect(jsonPath(shortNameToOAuth + "attributes.requestObjectEncryptionEnc").value("A128GCM"))
//                .andExpect(jsonPath(shortNameToOAuth + "attributes.initiateLoginUri").value("https://example.org/initiateLogin"))
//                .andExpect(jsonPath(shortNameToOAuth + "attributes.tokenEndpointAuthMethod").value("client_secret_basic"))
//                .andExpect(jsonPath(shortNameToOAuth + "attributes.requestObjectSigningAlg").value("RS256"))
//                .andExpect(jsonPath(shortNameToOAuth + "attributes.scopes").value("openid profile"))
//                .andExpect(jsonPath(shortNameToOAuth + "attributes.idTokenEncryptedResponseAlg").value("A256KW"))
//                .andExpect(jsonPath(shortNameToOAuth + "attributes.softwareVersion").value("mockSoftwareVersion"))
//                .andExpect(jsonPath(shortNameToOAuth + "postLogoutRedirectUris[0]").value("https://example.org/postLogout"))
//                .andExpect(jsonPath(shortNameToOAuth + "requestUris[0]").value("https://example.org/request"))
//                .andExpect(jsonPath(shortNameToOAuth + "audiences[0]").value("http://mypeeps"))
//                .andExpect(jsonPath(shortNameToOAuth + "defaultAcrValues").isArray())
//                .andExpect(jsonPath(shortNameToOAuth + "attributes.requireAuthTime").value(Boolean.FALSE))
//                .andExpect(jsonPath(shortNameToOAuth + "attributes.defaultMaxAge").value(Integer.valueOf(0)))
//    }
//
//    @SneakyThrows
//    private byte[] fromFile(String path) {
//        return new ClassPathResource(path).getInputStream().readAllBytes()
//    }
}