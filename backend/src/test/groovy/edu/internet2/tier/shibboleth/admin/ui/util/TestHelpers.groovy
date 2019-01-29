package edu.internet2.tier.shibboleth.admin.ui.util

import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import groovy.xml.XmlUtil
import org.apache.commons.lang.StringUtils
import org.springframework.security.core.context.SecurityContextHolder
import org.w3c.dom.Document
import org.xmlunit.builder.DiffBuilder
import org.xmlunit.builder.Input

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
class TestHelpers {
    static int determineCountOfAttributesFromRelyingPartyOverrides(Map<String, Object> relyingPartyOverridesRepresentation) {
        int count = 0

        relyingPartyOverridesRepresentation.entrySet().each {entry ->
            if (entry.value instanceof Collection) {
                count += ((Collection)entry.value).size() != 0 ? 1 : 0
            } else if (entry.value instanceof String) {
                count += StringUtils.isNotBlank((String)entry.value) ? 1 : 0
            } else {
                count++
            }
        }

        return count
    }

    static void generatedXmlIsTheSameAsExpectedXml(String expectedXmlResource, Document generatedXml) {
        assert !DiffBuilder.compare(Input.fromStream(TestHelpers.getResourceAsStream(expectedXmlResource)))
                .withTest(Input.fromDocument(generatedXml))
                .withAttributeFilter({attribute -> !attribute.name.equals("sourceDirectory")})
                .ignoreComments()
                .ignoreWhitespace()
                .build()
                .hasDifferences()
    }

    static String XmlDocumentToString(Document document) {
        return XmlUtil.serialize(document.documentElement)
    }

    static Optional<User> generateOptionalUser(String username, String rolename) {
        def user = new User(username: username, role: rolename)
        Optional.of(user)
    }
}
