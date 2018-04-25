package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService;
import net.shibboleth.utilities.java.support.resolver.CriteriaSet;
import net.shibboleth.utilities.java.support.resolver.ResolverException;
import org.opensaml.core.criterion.EntityIdCriterion;
import org.opensaml.core.xml.io.MarshallingException;
import org.opensaml.saml.metadata.resolver.MetadataResolver;
import org.opensaml.saml.saml2.metadata.EntityDescriptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

@Controller
@RequestMapping(value = "/api/entities", method = RequestMethod.GET)
public class EntitiesController {
    private static final Logger logger = LoggerFactory.getLogger(EntitiesController.class);

    @Autowired
    private MetadataResolver metadataResolver;

    @Autowired
    private EntityDescriptorService entityDescriptorService;

    @Autowired
    private OpenSamlObjects openSamlObjects;

    @RequestMapping(value = "{entityId:.*}")
    public ResponseEntity<?> getOne(final @PathVariable String entityId, HttpServletRequest request) throws UnsupportedEncodingException, ResolverException {
        EntityDescriptor entityDescriptor = this.getEntityDescriptor(entityId);
        if (entityDescriptor == null) {
            return ResponseEntity.notFound().build();
        }
        EntityDescriptorRepresentation entityDescriptorRepresentation = entityDescriptorService.createRepresentationFromDescriptor(entityDescriptor);
        return ResponseEntity.ok(entityDescriptorRepresentation);
    }

    @RequestMapping(value = "{entityId:.*}", produces = "application/xml")
    public ResponseEntity<?> getOneXml(final @PathVariable String entityId) throws MarshallingException, ResolverException, UnsupportedEncodingException {
        EntityDescriptor entityDescriptor = this.getEntityDescriptor(entityId);
        if (entityDescriptor == null) {
            return ResponseEntity.notFound().build();
        }
        final String xml = this.openSamlObjects.marshalToXmlString(entityDescriptor);
        return ResponseEntity.ok(xml);
    }

    private EntityDescriptor getEntityDescriptor(final String entityId) throws ResolverException, UnsupportedEncodingException {
        String decodedEntityId = URLDecoder.decode(entityId, "UTF-8");
        EntityDescriptor entityDescriptor = this.metadataResolver.resolveSingle(new CriteriaSet(new EntityIdCriterion(decodedEntityId)));
        // TODO: we need to clean this up sometime
        if (entityDescriptor instanceof edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor) {
            ((edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor) entityDescriptor).setResourceId(null);
        }
        return entityDescriptor;
    }
}
