package edu.internet2.tier.shibboleth.admin.ui.controller

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.i18n.MappedResourceBundleMessageSource
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.servlet.LocaleResolver
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor
import spock.lang.Specification

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, TestConfiguration, InternationalizationConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class InternationalizationMessagesControllerTests extends Specification {
    @Autowired
    MappedResourceBundleMessageSource messageSource

    @Autowired
    LocaleChangeInterceptor localeChangeInterceptor

    @Autowired
    LocaleResolver localResolver

    def controller
    def mockMvc

    def setup() {
        controller = new InternationalizationMessagesController(
                messageSource: messageSource
        )

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setLocaleResolver(localResolver)
                .addInterceptors(localeChangeInterceptor)
                .build()
    }

    def messagesUrl = "/api/messages"

    def expectedEnglishResult =
            '{' +
            '   "some.test.message": "This is the English test message."' +
            '}'

    def expectedFrenchResult =
            '{' +
            '   "some.test.message": "Je ne sais pas Francais."' +
            '}'

    def expectedDefaultResult =
            '{' +
            '   "some.test.message": "This is the default message."' +
            '}'

    def "GET messages with no header or \"lang\" param defaults to returning english messages"() {
        when:
        def result = mockMvc.perform(
                get(messagesUrl))

        then:
        result.andExpect(content().json(expectedEnglishResult))
    }

    def "GET messages with Accept-Language returns messages in that language"() {
        when:
        def result = mockMvc.perform(
                get(messagesUrl)
                        .header("Accept-Language", "fr"))

        then:
        result.andExpect(content().json(expectedFrenchResult))
    }

    def "GET messages with \"lang\" request param returns messages in that language"() {
        when:
        def result = mockMvc.perform(
                get(messagesUrl)
                        .param("lang", "fr"))

        then:
        result.andExpect(content().json(expectedFrenchResult))
    }

    def "GET messages with both Accept-Language header and \"lang\" request param returns messages in the language specified by the \"lang\" parameter"() {
        when:
        def result = mockMvc.perform(
                get(messagesUrl)
                        .header("Accept-Language", "en")
                        .param("lang", "fr"))

        then:
        result.andExpect(content().json(expectedFrenchResult))
    }

    def "GET messages with an unsupported Accept-Language returns the default language"() {
        when:
        def result = mockMvc.perform(
                get(messagesUrl)
                        .header("Accept-Language", "es"))

        then:
        result.andExpect(content().json(expectedEnglishResult))
    }
}
