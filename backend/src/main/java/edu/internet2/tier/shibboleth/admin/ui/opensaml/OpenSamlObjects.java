package edu.internet2.tier.shibboleth.admin.ui.opensaml;

import com.google.common.io.ByteSource;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.config.InitializationService;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.xml.BasicParserPool;
import net.shibboleth.utilities.java.support.xml.ParserPool;
import org.opensaml.core.config.ConfigurationService;
import org.opensaml.core.config.InitializationException;
import org.opensaml.core.xml.XMLObject;
import org.opensaml.core.xml.XMLObjectBuilderFactory;
import org.opensaml.core.xml.config.XMLObjectProviderRegistry;
import org.opensaml.core.xml.io.Marshaller;
import org.opensaml.core.xml.io.MarshallerFactory;
import org.opensaml.core.xml.io.MarshallingException;
import org.opensaml.core.xml.io.Unmarshaller;
import org.opensaml.core.xml.io.UnmarshallerFactory;
import org.opensaml.saml.saml2.metadata.EntityDescriptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.annotation.PostConstruct;
import javax.xml.namespace.QName;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;

public class OpenSamlObjects {
    Logger logger = LoggerFactory.getLogger(OpenSamlObjects.class);

    private XMLObjectBuilderFactory builderFactory;

    private MarshallerFactory marshallerFactory;

    private UnmarshallerFactory unmarshallerFactory;

    private BasicParserPool parserPool = new BasicParserPool();

    public XMLObjectBuilderFactory getBuilderFactory() {
        return this.builderFactory;
    }

    public MarshallerFactory getMarshallerFactory() {
        return this.marshallerFactory;
    }

    public UnmarshallerFactory getUnmarshallerFactory() {
        return this.unmarshallerFactory;
    }

    public ParserPool getParserPool() {
        return parserPool;
    }

    /**
     * Initialize opensaml.
     */
    @PostConstruct
    public void init() throws ComponentInitializationException {
        try {
            InitializationService.initialize();
        } catch (final InitializationException e) {
            throw new IllegalArgumentException("Exception initializing OpenSAML", e);
        }

        XMLObjectProviderRegistry registry;
        synchronized (ConfigurationService.class) {
            registry = ConfigurationService.get(XMLObjectProviderRegistry.class);
            if (registry == null) {
                registry = new XMLObjectProviderRegistry();
                ConfigurationService.register(XMLObjectProviderRegistry.class, registry);
            }
        }
        this.parserPool.initialize();
        registry.setParserPool(this.parserPool);
        this.builderFactory = registry.getBuilderFactory();
        this.marshallerFactory = registry.getMarshallerFactory();
        this.unmarshallerFactory = registry.getUnmarshallerFactory();
    }

    public String marshalToXmlString(XMLObject ed, boolean includeXMLDeclaration) throws MarshallingException {
        Marshaller marshaller = this.marshallerFactory.getMarshaller(ed);
        ed.releaseDOM();
        ed.releaseChildrenDOM(true);
        String entityDescriptorXmlString = null;
        if (marshaller != null) {
            try (StringWriter writer = new StringWriter()) {
                Transformer transformer = TransformerFactory.newInstance().newTransformer();
                transformer.setOutputProperty(OutputKeys.INDENT, "yes");
                transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");
                if (!includeXMLDeclaration) {
                    transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
                }
                transformer.transform(new DOMSource(marshaller.marshall(ed)), new StreamResult(writer));
                entityDescriptorXmlString = writer.toString();
            } catch (TransformerException | IOException e) {
                logger.error(e.getMessage(), e);
            }
        }

        if (entityDescriptorXmlString == null) {
            //Figure out the best way to deal with this case
            throw new RuntimeException("Unable to marshal EntityDescriptor");
        }
        return entityDescriptorXmlString;
    }

    public String marshalToXmlString(XMLObject ed) throws MarshallingException {
        return this.marshalToXmlString(ed, true);
    }

    public EntityDescriptor unmarshalFromXml(byte[] entityDescriptorXml) throws Exception {
        try (InputStream edIs = ByteSource.wrap(entityDescriptorXml).openBufferedStream()) {
            Document doc = this.parserPool.parse(edIs);
            Element e = doc.getDocumentElement();
            Unmarshaller unmarshaller = this.unmarshallerFactory.getUnmarshaller(e);
            if (unmarshaller != null) {
                //Cast here could be dangerous, but we want to make sure that only EntityDescriptor representation is being POSTed (somehow)
                return EntityDescriptor.class.cast(unmarshaller.unmarshall(e));
            }
            return null;
        }
    }

    // TODO: yeah, I'm not happy with this...
    public <T extends XMLObject> T buildDefaultInstanceOfType(Class<T> type) {
        try {
            QName defaultElementName = (QName) type.getField("DEFAULT_ELEMENT_NAME").get(null);
            return (T) this.getBuilderFactory().getBuilder(defaultElementName).buildObject(defaultElementName);
        } catch (IllegalAccessException | NoSuchFieldException e) {
            throw new RuntimeException("there was a problem building an instance", e);
        }
    }
}
