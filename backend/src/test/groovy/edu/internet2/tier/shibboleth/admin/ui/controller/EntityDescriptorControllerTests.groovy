package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.AssertionConsumerServiceRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.exception.EntityIdExistsException
import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException
import edu.internet2.tier.shibboleth.admin.ui.exception.InvalidPatternMatchException
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownership
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorVersionService
import edu.internet2.tier.shibboleth.admin.ui.service.EntityService
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityDescriptorServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.util.RandomGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.WithMockAdmin
import edu.internet2.tier.shibboleth.admin.util.EntityDescriptorConversionUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.NestedServletException
import spock.lang.Subject

import javax.persistence.EntityManager

import static org.hamcrest.CoreMatchers.containsString
import static org.springframework.http.MediaType.APPLICATION_JSON
import static org.springframework.http.MediaType.APPLICATION_XML
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class EntityDescriptorControllerTests extends AbstractBaseDataJpaTest {
    @Autowired
    EntityDescriptorRepository entityDescriptorRepository

    @Autowired
    EntityManager entityManager

    @Autowired
    EntityService entityService

    @Autowired
    TestObjectGenerator generator

    @Autowired
    ObjectMapper mapper

    @Autowired
    OpenSamlObjects openSamlObjects

    @Autowired
    JPAEntityDescriptorServiceImpl jpaEntityDescriptorService

    RandomGenerator randomGenerator
    def mockRestTemplate = Mock(RestTemplate)
    def mockMvc

    @Subject
    def controller

    EntityDescriptorVersionService versionService = Mock()
    
    @Transactional
    def setup() {
        openSamlObjects.init()

        Group gb = new Group()
        gb.setResourceId("testingGroupBBB")
        gb.setName("Group BBB")
        gb.setValidationRegex("^(?:https?:\\/\\/)?(?:[^.]+\\.)?shib\\.org(\\/.*)?\$")
        gb = groupService.createGroup(gb)

        randomGenerator = new RandomGenerator()

        controller = new EntityDescriptorController(versionService)
        controller.openSamlObjects = openSamlObjects
        controller.entityDescriptorService = jpaEntityDescriptorService
        controller.restTemplate = mockRestTemplate

        mockMvc = MockMvcBuilders.standaloneSetup(controller).build()
        
        Optional<Role> userRole = roleRepository.findByName("ROLE_USER")
        User user = new User(username: "someUser", roles:[userRole.get()], password: "foo")
        user.setGroup(gb)
        userService.save(user)
        
        EntityDescriptorConversionUtils.setOpenSamlObjects(openSamlObjects)
        EntityDescriptorConversionUtils.setEntityService(entityService)
    }

    @WithMockAdmin
    def 'DELETE as admin'() {
        given:
        def entityDescriptor = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: false)
        entityDescriptorRepository.save(entityDescriptor)

        when: 'pre-check'
        entityManager.flush()

        then:
        entityDescriptorRepository.findAll().size() == 1

        when:
        def result = mockMvc.perform(delete("/api/EntityDescriptor/uuid-1"))

        then:
        result.andExpect(status().isNoContent())
        entityDescriptorRepository.findByResourceId("uuid-1") == null
        entityDescriptorRepository.findAll().size() == 0
    }

    @WithMockAdmin
    def 'GET /EntityDescriptors with empty repository as admin'() {
        given:
        def expectedEmptyListResponseBody = '[]'
        def expectedResponseContentType = APPLICATION_JSON
        def expectedHttpResponseStatus = status().isOk()

        when:
        def result = mockMvc.perform(get('/api/EntityDescriptors'))

        then:
        result.andExpect(expectedHttpResponseStatus)
                .andExpect(content().contentType(expectedResponseContentType))
                .andExpect(content().json(expectedEmptyListResponseBody))
    }

    @WithMockAdmin
    def 'GET /EntityDescriptors with 1 record in repository as admin'() {
        given:
        def entityDescriptor = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true, idOfOwner: "admingroup")
        entityDescriptorRepository.saveAndFlush(entityDescriptor)

        def expectedResponseContentType = APPLICATION_JSON
        def expectedHttpResponseStatus = status().isOk()

        when:
        def result = mockMvc.perform(get('/api/EntityDescriptors'))

        then:
        result.andExpect(expectedHttpResponseStatus).andExpect(content().contentType(expectedResponseContentType))
              .andExpect(jsonPath("\$.[0].id").value("uuid-1"))
              .andExpect(jsonPath("\$.[0].entityId").value("eid1"))
              .andExpect(jsonPath("\$.[0].serviceEnabled").value(true))
              .andExpect(jsonPath("\$.[0].idOfOwner").value("admingroup"))
    }

    @WithMockAdmin
    def 'GET /EntityDescriptors with 2 records in repository as admin'() {
        given:
        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true, idOfOwner: "admingroup")
        def entityDescriptorTwo = new EntityDescriptor(resourceId: 'uuid-2', entityID: 'eid2', serviceProviderName: 'sp2', serviceEnabled: false, idOfOwner: "admingroup")

        entityDescriptorRepository.saveAndFlush(entityDescriptorOne)
        entityDescriptorRepository.saveAndFlush(entityDescriptorTwo)

        def expectedResponseContentType = APPLICATION_JSON
        def expectedHttpResponseStatus = status().isOk()

        when:
        def result = mockMvc.perform(get('/api/EntityDescriptors'))

        then:
        result.andExpect(expectedHttpResponseStatus)
              .andExpect(content().contentType(expectedResponseContentType))
              .andExpect(jsonPath("\$.[0].id").value("uuid-1"))
              .andExpect(jsonPath("\$.[0].entityId").value("eid1"))
              .andExpect(jsonPath("\$.[0].serviceEnabled").value(true))
              .andExpect(jsonPath("\$.[0].idOfOwner").value("admingroup"))
              .andExpect(jsonPath("\$.[1].id").value("uuid-2"))
              .andExpect(jsonPath("\$.[1].entityId").value("eid2"))
              .andExpect(jsonPath("\$.[1].serviceEnabled").value(false))
              .andExpect(jsonPath("\$.[1].idOfOwner").value("admingroup"))
    }

    @WithMockUser(value = "someUser", roles = ["USER"])
    def 'POST create new - entity id does not match pattern'() {
        when:
        def expectedEntityId = 'https://google.com/blah/blah'
        EntityDescriptorRepresentation edRep = new EntityDescriptorRepresentation()
        edRep.setEntityId(expectedEntityId)
        edRep.setServiceProviderName("spName")

        def edRepJson = mapper.writeValueAsString(edRep)

        then:
        try {
            mockMvc.perform(post('/api/EntityDescriptor').contentType(APPLICATION_JSON).content(edRepJson))
            false
        } catch (NestedServletException expected) {
            expected.getCause() instanceof InvalidPatternMatchException
        }
    }

    @WithMockUser(value = "someUser", roles = ["USER"])
    def 'POST create new - verifying validation on entityID and ACS locations'() {
        given:
        def expectedEntityId = 'https://shib.org/blah/blah'
        EntityDescriptorRepresentation edRep = new EntityDescriptorRepresentation()
        edRep.setEntityId(expectedEntityId)
        edRep.setServiceProviderName("spName")

        def acsList = new ArrayList<AssertionConsumerServiceRepresentation>()
        AssertionConsumerServiceRepresentation acsRep = new AssertionConsumerServiceRepresentation()
        acsRep.setIndex(0)
        acsRep.setLocationUrl("http://logout.shib.org/dologout")
        acsList.add(acsRep)
        edRep.setAssertionConsumerServices(acsList)

        def edRepJson = mapper.writeValueAsString(edRep)

        when:
        def result = mockMvc.perform(post('/api/EntityDescriptor').contentType(APPLICATION_JSON).content(edRepJson))

        then:
        result.andExpect(status().isCreated())
                .andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("\$.entityId").value("https://shib.org/blah/blah"))
                .andExpect(jsonPath("\$.serviceEnabled").value(false))
                .andExpect(jsonPath("\$.idOfOwner").value("testingGroupBBB"))

        when: "ACS url is bad"
        expectedEntityId = 'https://shib.org/blah/blah/again'
        edRep = new EntityDescriptorRepresentation()
        edRep.setEntityId(expectedEntityId)
        edRep.setServiceProviderName("spName")

        acsList = new ArrayList<AssertionConsumerServiceRepresentation>()
        acsRep = new AssertionConsumerServiceRepresentation()
        acsRep.setIndex(0)
        acsRep.setLocationUrl("http://shib.com/dologout")
        acsList.add(acsRep)
        edRep.setAssertionConsumerServices(acsList)
        edRepJson = mapper.writeValueAsString(edRep)

        then:
        try {
            mockMvc.perform(post('/api/EntityDescriptor').contentType(APPLICATION_JSON).content(edRepJson))
            false
        } catch (NestedServletException expected) {
            expected.getCause() instanceof InvalidPatternMatchException
        }
    }

    @WithMockAdmin
    def 'POST /EntityDescriptor and successfully create new record'() {
        given:
        def expectedEntityId = 'https://shib'
        def expectedSpName = 'sp1'
        def expectedResponseHeader = 'Location'
        def expectedResponseHeaderValue = "/api/EntityDescriptor/"

        def postedJsonBody = """
              {
	            "serviceProviderName": "$expectedSpName",
	            "entityId": "$expectedEntityId",
	            "organization": {},
	            "serviceEnabled": true,
	            "createdDate": null,
                "modifiedDate": null,
	            "contacts": null,
	            "serviceProviderSsoDescriptor": null,
	            "logoutEndpoints": null,
	            "securityInfo": null,
	            "assertionConsumerServices": null,
                "current": false
              }
        """

        when:
        def result = mockMvc.perform(post('/api/EntityDescriptor').contentType(APPLICATION_JSON).content(postedJsonBody))

        then:
        result.andExpect(status().isCreated())
              .andExpect(header().string(expectedResponseHeader, containsString(expectedResponseHeaderValue)))
              .andExpect(jsonPath("\$.entityId").value("https://shib"))
              .andExpect(jsonPath("\$.serviceEnabled").value(true))
              .andExpect(jsonPath("\$.idOfOwner").value("admingroup"))
    }

    @WithMockUser(value = "someUser", roles = ["USER"])
    def 'POST /EntityDescriptor as user disallows enabling'() {
        given:
        def expectedEntityId = 'https://shib'
        def expectedSpName = 'sp1'

        when:
        def postedJsonBody = """
              {
                "serviceProviderName": "$expectedSpName",
                "entityId": "$expectedEntityId",
                "organization": null,
                "serviceEnabled": true,
                "createdDate": null,
                "modifiedDate": null,
                "organization": null,
                "contacts": null,
                "mdui": null,
                "serviceProviderSsoDescriptor": null,
                "logoutEndpoints": null,
                "securityInfo": null,
                "assertionConsumerServices": null,
                "relyingPartyOverrides": null,
                "attributeRelease": null
              }
        """

        then:
        try {
            mockMvc.perform(post('/api/EntityDescriptor').contentType(APPLICATION_JSON).content(postedJsonBody))
        }
        catch (Exception e) {
            e instanceof ForbiddenException
        }
    }

    @WithMockAdmin
    def 'POST /EntityDescriptor record already exists'() {
        given:
        def postedJsonBody = """
              {
	            "serviceProviderName": "sp1",
	            "entityId": "eid1",
	            "organization": null,
	            "serviceEnabled": true,
	            "createdDate": null,
                "modifiedDate": null,
	            "organization": null,
	            "contacts": null,
	            "mdui": null,
	            "serviceProviderSsoDescriptor": null,
	            "logoutEndpoints": null,
	            "securityInfo": null,
	            "assertionConsumerServices": null,
	            "relyingPartyOverrides": null,
                "attributeRelease": null
              }
        """

        when:
        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true)
        def entityDescriptorTwo = new EntityDescriptor(resourceId: 'uuid-2', entityID: 'eid2', serviceProviderName: 'sp2', serviceEnabled: false)

        entityDescriptorRepository.save(entityDescriptorOne)
        entityDescriptorRepository.save(entityDescriptorTwo)
        entityManager.flush()

        then:
        try {
            mockMvc.perform(post('/api/EntityDescriptor').contentType(APPLICATION_JSON).content(postedJsonBody))
        }
        catch (Exception e) {
            e instanceof EntityIdExistsException
        }
    }

    @WithMockAdmin
    def 'GET /EntityDescriptor/{resourceId} non-existent'() {
        expect:
        try {
            mockMvc.perform(get("/api/EntityDescriptor/uuid-1"))
        }
        catch (Exception e) {
            e instanceof EntityNotFoundException
        }
    }

    @WithMockAdmin
    def 'GET /EntityDescriptor/{resourceId} existing'() {
        given:
        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true, idOfOwner: "admingroup")
        entityDescriptorRepository.save(entityDescriptorOne)
        entityManager.flush()

        when:
        def result = mockMvc.perform(get("/api/EntityDescriptor/uuid-1"))

        then:
        result.andExpect(status().isOk())
              .andExpect(jsonPath("\$.entityId").value("eid1"))
              .andExpect(jsonPath("\$.serviceProviderName").value("sp1"))
              .andExpect(jsonPath("\$.serviceEnabled").value(true))
              .andExpect(jsonPath("\$.idOfOwner").value("admingroup"))
    }

    @WithMockUser(value = "someUser", roles = ["USER"])
    def 'GET /EntityDescriptor/{resourceId} existing, validate group access'() {
        given:
        Group g = userService.getCurrentUserGroup()

        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true, idOfOwner: "someUser")
        def entityDescriptorTwo = new EntityDescriptor(resourceId: 'uuid-2', entityID: 'eid2', serviceProviderName: 'sp2', serviceEnabled: false, idOfOwner: Group.ADMIN_GROUP.getOwnerId())

        entityDescriptorRepository.saveAndFlush(entityDescriptorOne)
        entityDescriptorRepository.saveAndFlush(entityDescriptorTwo)

        ownershipRepository.saveAndFlush(new Ownership(g, entityDescriptorOne))
        ownershipRepository.saveAndFlush(new Ownership(Group.ADMIN_GROUP, entityDescriptorTwo))

        when:
        def result = mockMvc.perform(get("/api/EntityDescriptor/uuid-1"))

        then:
        result.andExpect(status().isOk())
              .andExpect(jsonPath("\$.entityId").value("eid1"))
              .andExpect(jsonPath("\$.serviceProviderName").value("sp1"))
              .andExpect(jsonPath("\$.serviceEnabled").value(true))
              .andExpect(jsonPath("\$.idOfOwner").value("someUser"))
    }

    @WithMockUser(value = "someUser", roles = ["USER"])
    def 'GET /EntityDescriptor/{resourceId} existing, owned by some other user'() {
        when:
        Group g = userService.getCurrentUserGroup()

        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true, idOfOwner: g.getOwnerId())
        def entityDescriptorTwo = new EntityDescriptor(resourceId: 'uuid-2', entityID: 'eid2', serviceProviderName: 'sp2', serviceEnabled: false, idOfOwner: Group.ADMIN_GROUP.getOwnerId())

        entityDescriptorRepository.saveAndFlush(entityDescriptorOne)
        entityDescriptorRepository.saveAndFlush(entityDescriptorTwo)

        ownershipRepository.saveAndFlush(new Ownership(g, entityDescriptorOne))
        ownershipRepository.saveAndFlush(new Ownership(Group.ADMIN_GROUP, entityDescriptorTwo))

        then:
        try {
            mockMvc.perform(get("/api/EntityDescriptor/uuid-2"))
        }
        catch (Exception e) {
            e instanceof ForbiddenException
        }
    }

    @WithMockAdmin
    def 'GET /EntityDescriptor/{resourceId} existing (xml)'() {
        given:
        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true)
        entityDescriptorOne.setElementLocalName("EntityDescriptor")
        entityDescriptorOne.setNamespacePrefix("md")
        entityDescriptorOne.setNamespaceURI("urn:oasis:names:tc:SAML:2.0:metadata")
        entityDescriptorRepository.save(entityDescriptorOne)
        entityManager.flush()

        def expectedXML = """<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor
	xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="eid1"/>"""

        when:
        def result = mockMvc.perform(get("/api/EntityDescriptor/uuid-1").accept(APPLICATION_XML))

        then:
        result.andExpect(status().isOk()).andExpect(content().xml(expectedXML))
    }

    @WithMockUser(value = "someUser", roles = ["USER"])
    def 'GET /EntityDescriptor/{resourceId} existing (xml), user-owned'() {
        given:
        Group g = userService.getCurrentUserGroup()

        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true, idOfOwner: g.getOwnerId())
        entityDescriptorOne.setElementLocalName("EntityDescriptor")
        entityDescriptorOne.setNamespacePrefix("md")
        entityDescriptorOne.setNamespaceURI("urn:oasis:names:tc:SAML:2.0:metadata")
        entityDescriptorOne = entityDescriptorRepository.saveAndFlush(entityDescriptorOne)
        ownershipRepository.saveAndFlush(new Ownership(g,entityDescriptorOne))

        def expectedXML = """<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor
    xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="eid1"/>"""

        when:
        def result = mockMvc.perform(get("/api/EntityDescriptor/uuid-1").accept(APPLICATION_XML))

        then:
        result.andExpect(status().isOk()).andExpect(content().xml(expectedXML))
    }

    @WithMockUser(value = "someUser", roles = ["USER"])
    def 'GET /EntityDescriptor/{resourceId} existing (xml), other user-owned'() {
        when:
        Group g = Group.ADMIN_GROUP

        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true, idOfOwner: g.getOwnerId())
        entityDescriptorOne.setElementLocalName("EntityDescriptor")
        entityDescriptorOne.setNamespacePrefix("md")
        entityDescriptorOne.setNamespaceURI("urn:oasis:names:tc:SAML:2.0:metadata")
        entityDescriptorRepository.save(entityDescriptorOne)
        entityManager.flush()

        then:
        try {
            mockMvc.perform(get("/api/EntityDescriptor/$providedResourceId").accept(APPLICATION_XML))
        }
        catch (Exception e) {
            e instanceof ForbiddenException
        }
    }

    @WithMockAdmin
    def "POST /EntityDescriptor handles XML happily"() {
        given:
        def postedBody = '''<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="http://test.scaldingspoon.org/test1">
  <md:Extensions>
    <mdattr:EntityAttributes xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute">
      <saml:Attribute xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" Name="http://scaldingspoon.org/realm" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri">
        <saml:AttributeValue>internal</saml:AttributeValue>
      </saml:Attribute>
      <saml:Attribute xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" Name="http://shibboleth.net/ns/attributes/releaseAllValues" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri">
        <saml:AttributeValue>givenName</saml:AttributeValue>
        <saml:AttributeValue>employeeNumber</saml:AttributeValue>
      </saml:Attribute>
    </mdattr:EntityAttributes>
  </md:Extensions>
  <md:SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</md:NameIDFormat>
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://test.scaldingspoon.org/test1/acs" index="1"/>
  </md:SPSSODescriptor>
</md:EntityDescriptor>
'''
        def expectedResponseHeader = 'Location'
        def expectedResponseHeaderValue = "/api/EntityDescriptor/"

        when:
        def spName = randomGenerator.randomString()
        def result = mockMvc.perform(post("/api/EntityDescriptor").contentType(APPLICATION_XML).content(postedBody).param("spName", spName))

        then:
        result.andExpect(status().isCreated())
              .andExpect(header().string(expectedResponseHeader, containsString(expectedResponseHeaderValue)))
              .andExpect(jsonPath("\$.entityId").value("http://test.scaldingspoon.org/test1"))
              .andExpect(jsonPath("\$.serviceEnabled").value(false))
              .andExpect(jsonPath("\$.idOfOwner").value("admingroup"))
              .andExpect(jsonPath("\$.serviceProviderSsoDescriptor.protocolSupportEnum").value("SAML 2"))
              .andExpect(jsonPath("\$.serviceProviderSsoDescriptor.nameIdFormats[0]").value("urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified"))
              .andExpect(jsonPath("\$.assertionConsumerServices[0].binding").value("urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"))
              .andExpect(jsonPath("\$.assertionConsumerServices[0].makeDefault").value(false))
              .andExpect(jsonPath("\$.assertionConsumerServices[0].locationUrl").value("https://test.scaldingspoon.org/test1/acs"))

    }

    @WithMockAdmin
    def "POST /EntityDescriptor returns error for duplicate entity id"() {
        when:
        def postedBody = '''<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="http://test.scaldingspoon.org/test1">
  <md:Extensions>
    <mdattr:EntityAttributes xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute">
      <saml:Attribute xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" Name="http://scaldingspoon.org/realm" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri">
        <saml:AttributeValue>internal</saml:AttributeValue>
      </saml:Attribute>
      <saml:Attribute xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" Name="http://shibboleth.net/ns/attributes/releaseAllValues" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri">
        <saml:AttributeValue>givenName</saml:AttributeValue>
        <saml:AttributeValue>employeeNumber</saml:AttributeValue>
      </saml:Attribute>
    </mdattr:EntityAttributes>
  </md:Extensions>
  <md:SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</md:NameIDFormat>
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://test.scaldingspoon.org/test1/acs" index="1"/>
  </md:SPSSODescriptor>
</md:EntityDescriptor>
'''
        def spName = randomGenerator.randomString()
        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true)
        def entityDescriptorTwo = new EntityDescriptor(resourceId: 'uuid-2', entityID: 'http://test.scaldingspoon.org/test1', serviceProviderName: 'sp2', serviceEnabled: false)

        entityDescriptorRepository.save(entityDescriptorOne)
        entityDescriptorRepository.save(entityDescriptorTwo)
        entityManager.flush()

        then:
        try {
            mockMvc.perform(post("/api/EntityDescriptor").contentType(APPLICATION_XML).content(postedBody).param("spName", spName))
        }
        catch (Exception e) {
            e instanceof EntityIdExistsException
        }
    }

    @WithMockAdmin
    def "PUT /EntityDescriptor updates entity descriptors properly as admin"() {
        given:
        def entityDescriptorTwo = new EntityDescriptor(resourceId: 'uuid-2', entityID: 'eid2', serviceProviderName: 'sp2', serviceEnabled: false, idOfOwner: Group.ADMIN_GROUP.getOwnerId())

        entityDescriptorTwo = entityDescriptorRepository.save(entityDescriptorTwo)
        entityManager.flush()
        entityManager.clear()

        def updatedEntityDescriptorRepresentation = jpaEntityDescriptorService.createRepresentationFromDescriptor(entityDescriptorTwo)
        updatedEntityDescriptorRepresentation.setServiceProviderName("newName")
        def postedJsonBody = mapper.writeValueAsString(updatedEntityDescriptorRepresentation)

        when:
        def result = mockMvc.perform(put("/api/EntityDescriptor/uuid-2").contentType(APPLICATION_JSON).content(postedJsonBody))

        then:
        result.andExpect(status().isOk())
              .andExpect(jsonPath("\$.entityId").value("eid2"))
              .andExpect(jsonPath("\$.serviceEnabled").value(false))
              .andExpect(jsonPath("\$.idOfOwner").value("admingroup"))
              .andExpect(jsonPath("\$.serviceProviderName").value("newName"))
    }

    @WithMockUser(value = "someUser", roles = ["USER"])
    def "PUT /EntityDescriptor disallows non-admin user from enabling"() {
        given:
        Group g = userService.getCurrentUserGroup()

        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: false, idOfOwner: g.getOwnerId())
        entityDescriptorOne = entityDescriptorRepository.save(entityDescriptorOne)
        entityManager.flush()

        when:
        entityDescriptorOne.serviceEnabled = true
        entityDescriptorOne.resourceId = 'uuid-1'
        def updatedEntityDescriptorRepresentation = jpaEntityDescriptorService.createRepresentationFromDescriptor(entityDescriptorOne)
        updatedEntityDescriptorRepresentation.version = entityDescriptorOne.hashCode()
        def postedJsonBody = mapper.writeValueAsString(updatedEntityDescriptorRepresentation)

        then:
        try {
            mockMvc.perform(put("/api/EntityDescriptor/uuid-1").contentType(APPLICATION_JSON).content(postedJsonBody))
        }
        catch (Exception e) {
            e instanceof ForbiddenException
        }
    }

    @WithMockUser(value = "someUser", roles = ["USER"])
    def "PUT /EntityDescriptor denies the request if the PUTing user is not an ADMIN and not the createdBy user"() {
        given:
        Group g = userService.getCurrentUserGroup()

        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true, idOfOwner: g.getOwnerId())
        entityDescriptorOne = entityDescriptorRepository.save(entityDescriptorOne)
        entityManager.flush()

        when:
        entityDescriptorOne.serviceProviderName = 'foo'
        entityDescriptorOne.resourceId = 'uuid-1'
        def updatedEntityDescriptorRepresentation = jpaEntityDescriptorService.createRepresentationFromDescriptor(entityDescriptorOne)
        updatedEntityDescriptorRepresentation.version = entityDescriptorOne.hashCode()
        def postedJsonBody = mapper.writeValueAsString(updatedEntityDescriptorRepresentation)

        then:
        try {
            mockMvc.perform(put("/api/EntityDescriptor/uuid-1").contentType(APPLICATION_JSON).content(postedJsonBody))
        }
        catch (Exception e) {
            e instanceof ForbiddenException
        }
    }

    @WithMockAdmin
    def "PUT /EntityDescriptor throws a concurrent mod exception if the version numbers don't match"() {
        given:
        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true, idOfOwner: Group.ADMIN_GROUP.getOwnerId())
        entityDescriptorOne = entityDescriptorRepository.save(entityDescriptorOne)
        entityManager.flush()

        when:
        entityDescriptorOne.serviceProviderName = 'foo'
        entityDescriptorOne.resourceId = 'uuid-1'
        def updatedEntityDescriptorRepresentation = jpaEntityDescriptorService.createRepresentationFromDescriptor(entityDescriptorOne)

        def postedJsonBody = mapper.writeValueAsString(updatedEntityDescriptorRepresentation)

        then:
        try {
            mockMvc.perform(put("/api/EntityDescriptor/$resourceId").contentType(APPLICATION_JSON).content(postedJsonBody))
        }
        catch (Exception e) {
            e instanceof ConcurrentModificationException
        }
    }
}