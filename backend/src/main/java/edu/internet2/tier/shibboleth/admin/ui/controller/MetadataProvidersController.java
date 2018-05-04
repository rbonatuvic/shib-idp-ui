package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.IOException;
import java.io.StringWriter;

@Controller
@RequestMapping(value = "/api/metadataProviders")
public class MetadataProvidersController {
    private static final Logger logger = LoggerFactory.getLogger(MetadataProvidersController.class);

    @Autowired
    MetadataResolverService metadataResolverService;

    @RequestMapping(produces = "application/xml")
    public ResponseEntity<?> getXml() throws IOException, TransformerException {
        // TODO: externalize
        try (StringWriter writer = new StringWriter()) {
            Transformer transformer = TransformerFactory.newInstance().newTransformer();
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");

            transformer.transform(new DOMSource(metadataResolverService.generateConfiguration()), new StreamResult(writer));
            return ResponseEntity.ok(writer.toString());
        }
    }
}
