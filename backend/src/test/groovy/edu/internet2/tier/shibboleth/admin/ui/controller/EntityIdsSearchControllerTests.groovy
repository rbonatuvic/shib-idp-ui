package edu.internet2.tier.shibboleth.admin.ui.controller

import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityIdsSearchResultRepresentation
import edu.internet2.tier.shibboleth.admin.ui.service.EntityIdsSearchService
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import spock.lang.Specification
import spock.lang.Subject

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
class EntityIdsSearchControllerTests extends Specification {

    def entityIdsSearchService = Mock(EntityIdsSearchService)

    static final String NO_LIMIT = "10" // when no limit is specified, it defaults to 10

    @Subject
    def controller = new EntityIdsSearchController (entityIdsSearchService)

    def mockMvc = MockMvcBuilders.standaloneSetup(controller).build()

    static final String RESOURCE_ID = "resourceId"
    static final String RESOURCE_ID_VALUE = "test"
    static final String TERM = "term"
    static final String LIMIT = "limit"

    def "GET /api/EntityIds/search with unicon and limit 5"() {
        given:
        def termValue = "unicon"
        def limitValue = "5"
        def expectedEntityIdsFromSearchService = new EntityIdsSearchResultRepresentation(["http://unicon.instructure.com/saml2", "https://idp.unicon.net/idp/shibboleth"])
        def expectedHttpResponseStatus = status().isOk()
        def expectedResponseContentType = APPLICATION_JSON_UTF8
        def expectedResponseBody = """
            {
                "entityIds":[
                    "http://unicon.instructure.com/saml2",
                    "https://idp.unicon.net/idp/shibboleth"
                ]
            }
        """

        when:
        def result = mockMvc.perform(get('/api/EntityIds/search')
                .param(RESOURCE_ID, RESOURCE_ID_VALUE)
                .param(TERM, termValue)
                .param(LIMIT, limitValue))

        then:
        result.andExpect(expectedHttpResponseStatus)
        1 * entityIdsSearchService.findBySearchTermAndOptionalLimit(RESOURCE_ID_VALUE, termValue, Integer.valueOf(limitValue)) >> expectedEntityIdsFromSearchService
        result.andExpect(expectedHttpResponseStatus)
            .andExpect(content().contentType(expectedResponseContentType))
            .andExpect(content().json(expectedResponseBody, true))
    }

    def "GET /api/EntityIds/search with unicon and limit 1"() {
        given:
        def termValue = "unicon"
        def limitValue = "1"
        def expectedEntityIdsFromSearchService = new EntityIdsSearchResultRepresentation(["http://unicon.instructure.com/saml2"])
        def expectedHttpResponseStatus = status().isOk()
        def expectedResponseContentType = APPLICATION_JSON_UTF8
        def expectedResponseBody = """
            {
                "entityIds":[
                    "http://unicon.instructure.com/saml2"
                ]
            }
        """

        when:
        def result = mockMvc.perform(get('/api/EntityIds/search')
                .param(RESOURCE_ID, RESOURCE_ID_VALUE)
                .param(TERM, termValue)
                .param(LIMIT, limitValue))

        then:
        result.andExpect(expectedHttpResponseStatus)
        1 * entityIdsSearchService.findBySearchTermAndOptionalLimit(RESOURCE_ID_VALUE, termValue, Integer.valueOf(limitValue)) >> expectedEntityIdsFromSearchService
        result.andExpect(expectedHttpResponseStatus)
                .andExpect(content().contentType(expectedResponseContentType))
                .andExpect(content().json(expectedResponseBody, true))
    }

    def "GET /api/EntityIds/search with shib and no limit"() {
        given:
        def termValue = "shib"
        def limitValue = NO_LIMIT
        def expectedEntityIdsFromSearchService = new EntityIdsSearchResultRepresentation(["https://shib.ucanr.org/shibboleth",
                                                                                          "https://shibboleth2sp.tf.semcs.net/shibboleth",
                                                                                          "https://shibboleth.gradesfirst.com/Shibboleth.sso",
                                                                                          "https://idp.shibboleth.stir.ac.uk/shibboleth",
                                                                                          "https://shib.theiet.org/shibboleth",
                                                                                          "https://shib.rsc.org/shibboleth",
                                                                                          "https://srvshibboleth.asfc.ac.uk/shibboleth",
                                                                                          "https://shibboleth.webassign.net/shibboleth",
                                                                                          "https://shibbox.lpplus.net/shibboleth",
                                                                                          "https://shibsp.amherst.edu/shibboleth"])
        def expectedHttpResponseStatus = status().isOk()
        def expectedResponseContentType = APPLICATION_JSON_UTF8
        def expectedResponseBody = """
            {
                "entityIds":[
                    "https://shib.ucanr.org/shibboleth",
                    "https://shibboleth2sp.tf.semcs.net/shibboleth",
                    "https://shibboleth.gradesfirst.com/Shibboleth.sso",
                    "https://idp.shibboleth.stir.ac.uk/shibboleth",
                    "https://shib.theiet.org/shibboleth",
                    "https://shib.rsc.org/shibboleth",
                    "https://srvshibboleth.asfc.ac.uk/shibboleth",
                    "https://shibboleth.webassign.net/shibboleth",
                    "https://shibbox.lpplus.net/shibboleth",
                    "https://shibsp.amherst.edu/shibboleth"
                ]
            }
        """

        when:
        def result = mockMvc.perform(get('/api/EntityIds/search')
                .param(RESOURCE_ID, RESOURCE_ID_VALUE)
                .param(TERM, termValue))

        then:
        result.andExpect(expectedHttpResponseStatus)
        1 * entityIdsSearchService.findBySearchTermAndOptionalLimit(RESOURCE_ID_VALUE, termValue, Integer.valueOf(limitValue)) >> expectedEntityIdsFromSearchService
        result.andExpect(expectedHttpResponseStatus)
                .andExpect(content().contentType(expectedResponseContentType))
                .andExpect(content().json(expectedResponseBody, true))
    }

    def "GET /api/EntityIds/search with empty term and limit 5"() {
        given:
        def termValue = ""
        def limitValue = "5"
        def expectedEntityIdsFromSearchService = new EntityIdsSearchResultRepresentation([])
        def expectedHttpResponseStatus = status().isOk()
        def expectedResponseContentType = APPLICATION_JSON_UTF8
        def expectedResponseBody = """
            {
                "entityIds":[]
            }
        """

        when:
        def result = mockMvc.perform(get('/api/EntityIds/search')
                .param(RESOURCE_ID, RESOURCE_ID_VALUE)
                .param(TERM, termValue)
                .param(LIMIT, limitValue))

        then:
        result.andExpect(expectedHttpResponseStatus)
        1 * entityIdsSearchService.findBySearchTermAndOptionalLimit(RESOURCE_ID_VALUE, termValue, Integer.valueOf(limitValue)) >> expectedEntityIdsFromSearchService
        result.andExpect(expectedHttpResponseStatus)
                .andExpect(content().contentType(expectedResponseContentType))
                .andExpect(content().json(expectedResponseBody, true))
    }

    def "GET /api/EntityIds/search with empty term and no limit"() {
        given:
        def termValue = ""
        def limitValue = NO_LIMIT
        def expectedEntityIdsFromSearchService = new EntityIdsSearchResultRepresentation([])
        def expectedHttpResponseStatus = status().isOk()
        def expectedResponseContentType = APPLICATION_JSON_UTF8
        def expectedResponseBody = """
            {
                "entityIds":[]
            }
        """

        when:
        def result = mockMvc.perform(get('/api/EntityIds/search')
                .param(RESOURCE_ID, RESOURCE_ID_VALUE)
                .param(TERM, termValue)
                .param(LIMIT, limitValue))

        then:
        result.andExpect(expectedHttpResponseStatus)
        1 * entityIdsSearchService.findBySearchTermAndOptionalLimit(RESOURCE_ID_VALUE, termValue, Integer.valueOf(limitValue)) >> expectedEntityIdsFromSearchService
        result.andExpect(expectedHttpResponseStatus)
                .andExpect(content().contentType(expectedResponseContentType))
                .andExpect(content().json(expectedResponseBody, true))
    }
}