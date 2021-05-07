package edu.internet2.tier.shibboleth.admin.ui.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import javax.servlet.http.HttpServletRequest;

import org.opensaml.core.criterion.EntityIdCriterion;
import org.opensaml.core.xml.io.MarshallingException;
import org.opensaml.saml.metadata.resolver.MetadataResolver;
import org.opensaml.saml.saml2.metadata.EntityDescriptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService;
import lombok.extern.slf4j.Slf4j;
import net.shibboleth.utilities.java.support.resolver.CriteriaSet;
import net.shibboleth.utilities.java.support.resolver.ResolverException;

@Controller
@RequestMapping(value = { "/entities", // per protocol - https://spaces.at.internet2.edu/display/MDQ/Metadata+Query+Protocol
                          "/api/entities" }, // existing - included to break no existing code
                method = RequestMethod.GET)
@Slf4j
public class EntitiesController {
    @Autowired
    private EntityDescriptorService entityDescriptorService;

    @Autowired
    private OpenSamlObjects openSamlObjects;
    
    @Autowired
    private EntityDescriptorRepository entityDescriptorRepository;

    @RequestMapping(value = "/{entityId:.*}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getOne(final @PathVariable String entityId, HttpServletRequest request) throws UnsupportedEncodingException, ResolverException {
        EntityDescriptor entityDescriptor = this.getEntityDescriptor(entityId);
        if (entityDescriptor == null) {
            return ResponseEntity.notFound().build();
        }
        EntityDescriptorRepresentation entityDescriptorRepresentation = entityDescriptorService.createRepresentationFromDescriptor(entityDescriptor);
        ResponseEntity result =  ResponseEntity.ok(entityDescriptorRepresentation);
        return result;
    }

    @RequestMapping(value = "/{entityId:.*}", produces = "application/xml")
    @Transactional(readOnly = true)
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
        EntityDescriptor entityDescriptor = entityDescriptorRepository.findByEntityID(decodedEntityId);
        // TODO: we need to clean this up sometime
        if (entityDescriptor instanceof edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor) {
            ((edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor) entityDescriptor).setResourceId(null);
        }
        return entityDescriptor;
    }
}
