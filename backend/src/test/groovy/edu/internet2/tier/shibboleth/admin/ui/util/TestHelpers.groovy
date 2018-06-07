package edu.internet2.tier.shibboleth.admin.ui.util

import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.RelyingPartyOverridesRepresentation
import org.apache.commons.lang.StringUtils
import org.w3c.dom.Document
import org.xmlunit.builder.DiffBuilder
import org.xmlunit.builder.Input

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
class TestHelpers {
    static int determineCountOfAttributesFromRelyingPartyOverrides(RelyingPartyOverridesRepresentation relyingPartyOverridesRepresentation) {
        int count = 0

        count += relyingPartyOverridesRepresentation.authenticationMethods.size() != 0 ? 1 : 0
        count += relyingPartyOverridesRepresentation.dontSignResponse ? 1 : 0
        count += relyingPartyOverridesRepresentation.ignoreAuthenticationMethod ? 1 : 0
        count += relyingPartyOverridesRepresentation.nameIdFormats.size() != 0 ? 1 : 0
        count += relyingPartyOverridesRepresentation.omitNotBefore ? 1 : 0
        count += relyingPartyOverridesRepresentation.signAssertion ? 1 : 0
        count += relyingPartyOverridesRepresentation.turnOffEncryption ? 1 : 0
        count += relyingPartyOverridesRepresentation.useSha ? 1 : 0
        count += StringUtils.isNotBlank(relyingPartyOverridesRepresentation.responderId) ? 1 : 0

        return count
    }

    static generatedXmlTheSameAsExpectedXml(String expectedXmlResource, Document generatedXml) {
        !DiffBuilder.compare(Input.fromStream(this.class.getResourceAsStream(expectedXmlResource))).withTest(Input.fromDocument(generatedXml)).ignoreComments().ignoreWhitespace().build().hasDifferences()
    }
}
