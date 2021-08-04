package edu.internet2.tier.shibboleth.admin.ui.util

import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import groovy.xml.XmlUtil
import junit.framework.Assert
import javax.xml.transform.Source;
import javax.xml.transform.Transformer
import javax.xml.transform.TransformerException
import javax.xml.transform.TransformerFactory
import javax.xml.transform.dom.DOMSource
import javax.xml.transform.stream.StreamResult

import org.apache.commons.lang.StringUtils
import org.springframework.security.core.context.SecurityContextHolder
import org.w3c.dom.Document
import org.xmlunit.builder.DiffBuilder
import org.xmlunit.builder.Input
import org.xmlunit.builder.Input.Builder

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
            } else if (entry.value instanceof Boolean) {
                count += Boolean.valueOf((Boolean)entry.value) ? 1 : 0
            }
        }

        return count
    }

    static void generatedXmlIsTheSameAsExpectedXml(String expectedXmlResource, Document generatedXml) {
        def Builder builder = Input.fromDocument(generatedXml)
        def Source source = builder.build()
        def myDiff = DiffBuilder.compare(Input.fromStream(TestHelpers.getResourceAsStream(expectedXmlResource)))
                .withTest(builder)
                .withAttributeFilter({attribute -> !attribute.name.equals("sourceDirectory")})
                .ignoreComments()
                .ignoreWhitespace()
                .build()
        System.out.println("@@@ \n" + getString(source) + "\n")
        Assert.assertFalse(myDiff.toString(), myDiff.hasDifferences());
    }

    public static String getString(DOMSource domSource) throws TransformerException {
        StringWriter writer = new StringWriter();
        StreamResult result = new StreamResult(writer);
        TransformerFactory tf = TransformerFactory.newInstance();
        Transformer transformer = tf.newTransformer();
        transformer.transform(domSource, result);
        return writer.toString();
    }
    
    static String XmlDocumentToString(Document document) {
        return XmlUtil.serialize(document.documentElement)
    }

    static Optional<User> generateOptionalUser(String username, String rolename) {
        def user = new User(username: username, role: rolename)
        Optional.of(user)
    }
}
