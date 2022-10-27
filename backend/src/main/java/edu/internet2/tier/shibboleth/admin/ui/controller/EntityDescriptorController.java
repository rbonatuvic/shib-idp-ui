package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import edu.internet2.tier.shibboleth.admin.ui.exception.InvalidPatternMatchException;
import edu.internet2.tier.shibboleth.admin.ui.exception.ObjectIdExistsException;
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorVersionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.tags.Tags;
import lombok.extern.slf4j.Slf4j;
import org.opensaml.core.xml.io.MarshallingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.annotation.PostConstruct;
import java.net.URI;
import java.util.ConcurrentModificationException;

@RestController
@RequestMapping("/api")
@Slf4j
@Tags(value = {@Tag(name = "entity")})
public class EntityDescriptorController {
    static URI getResourceUriFor(String resourceId) {
        return ServletUriComponentsBuilder
                .fromCurrentServletMapping().path("/api/EntityDescriptor")
                .pathSegment(resourceId)
                .build()
                .toUri();
    }
    
    @Autowired
    private EntityDescriptorService entityDescriptorService;

    @Autowired
    private OpenSamlObjects openSamlObjects;

    private RestTemplate restTemplate;

    @Autowired
    RestTemplateBuilder restTemplateBuilder;

    private EntityDescriptorVersionService versionService;

    public EntityDescriptorController(EntityDescriptorVersionService versionService) {
        this.versionService = versionService;
    }

    @PostMapping("/EntityDescriptor")
    @Transactional
    public ResponseEntity<?> create(@RequestBody EntityDescriptorRepresentation edRepresentation) throws ForbiddenException, ObjectIdExistsException, InvalidPatternMatchException {
        EntityDescriptorRepresentation persistedEd = entityDescriptorService.createNew(edRepresentation);            
        return ResponseEntity.created(getResourceUriFor(persistedEd.getId())).body(persistedEd);
    }

    @Secured("ROLE_ADMIN")
    @DeleteMapping(value = "/EntityDescriptor/{resourceId}")
    @Transactional
    public ResponseEntity<?> deleteOne(@PathVariable String resourceId) throws ForbiddenException, PersistentEntityNotFound {
        entityDescriptorService.delete(resourceId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/EntityDescriptors")
    @Transactional
    public ResponseEntity<?> getAll() throws ForbiddenException {
        return ResponseEntity.ok(entityDescriptorService.getAllEntityDescriptorProjectionsBasedOnUserAccess());
    }

    @GetMapping("/EntityDescriptor/{resourceId}/Versions")
    @Transactional
    public ResponseEntity<?> getAllVersions(@PathVariable String resourceId) throws PersistentEntityNotFound, ForbiddenException {
        // this "get by resource id" verifies that both the ED exists and the user has proper access, so needs to remain
        EntityDescriptor ed = entityDescriptorService.getEntityDescriptorByResourceId(resourceId);
        return ResponseEntity.ok(versionService.findVersionsForEntityDescriptor(ed.getResourceId()));
    }

    @Secured("ROLE_ADMIN")
    @Transactional
    @GetMapping(value = "/EntityDescriptor/disabledNonAdmin")
    public Iterable<EntityDescriptorRepresentation> getDisabledAndNotOwnedByAdmin() throws ForbiddenException {
        return entityDescriptorService.getAllDisabledAndNotOwnedByAdmin();
    }

    @GetMapping("/EntityDescriptor/{resourceId}")
    @Transactional
    public ResponseEntity<?> getOne(@PathVariable String resourceId) throws PersistentEntityNotFound, ForbiddenException {
        return ResponseEntity.ok(entityDescriptorService.createRepresentationFromDescriptor(entityDescriptorService.getEntityDescriptorByResourceId(resourceId)));
    }

    @GetMapping(value = "/EntityDescriptor/{resourceId}", produces = "application/xml")
    @Transactional
    public ResponseEntity<?> getOneXml(@PathVariable String resourceId) throws MarshallingException, PersistentEntityNotFound, ForbiddenException {
        EntityDescriptor ed = entityDescriptorService.getEntityDescriptorByResourceId(resourceId);
        final String xml = this.openSamlObjects.marshalToXmlString(ed);
        return ResponseEntity.ok(xml);
    }

    @GetMapping("/EntityDescriptor/{resourceId}/Versions/{versionId}")
    public ResponseEntity<?> getSpecificVersion(@PathVariable String resourceId, @PathVariable String versionId) throws
                    PersistentEntityNotFound, ForbiddenException {
        // this "get by resource id" verifies that both the ED exists and the user has proper access, so needs to remain
        EntityDescriptor ed = entityDescriptorService.getEntityDescriptorByResourceId(resourceId);
        EntityDescriptorRepresentation result = versionService.findSpecificVersionOfEntityDescriptor(ed.getResourceId(), versionId);
        return ResponseEntity.ok(result);
    }
  
    private ResponseEntity<?> handleUploadingEntityDescriptorXml(byte[] rawXmlBytes, String spName) throws Exception {
        final EntityDescriptor ed = EntityDescriptor.class.cast(openSamlObjects.unmarshalFromXml(rawXmlBytes));
        if (entityDescriptorService.entityExists(ed.getEntityID())) {
            throw new ObjectIdExistsException("Entity with ID: " + ed.getEntityID() + "exists");
        }

        ed.setServiceProviderName(spName);

        EntityDescriptorRepresentation persistedEd = entityDescriptorService.createNewEntityDescriptorFromXMLOrigin(ed);
        return ResponseEntity.created(getResourceUriFor(persistedEd.getId())).body(persistedEd);
    }

    @PostConstruct
    public void initRestTemplate() {
        this.restTemplate = restTemplateBuilder.build();
    }

    @PutMapping("/EntityDescriptor/{resourceId}")
    @Transactional
    public ResponseEntity<?> update(@RequestBody EntityDescriptorRepresentation edRepresentation, @PathVariable String resourceId)
                    throws ForbiddenException, ConcurrentModificationException, PersistentEntityNotFound, InvalidPatternMatchException {
        edRepresentation.setId(resourceId); // This should be the same already, but just to be safe...
        EntityDescriptorRepresentation result = entityDescriptorService.update(edRepresentation);
        return ResponseEntity.ok().body(result);
    }

    @PutMapping("/EntityDescriptor/{resourceId}/changeGroup/{groupId}")
    @Transactional
    public ResponseEntity<?> updateGroupForEntityDescriptor(@PathVariable String resourceId, @PathVariable String groupId)
                    throws ForbiddenException, ConcurrentModificationException, PersistentEntityNotFound, InvalidPatternMatchException {
        EntityDescriptorRepresentation result = entityDescriptorService.updateGroupForEntityDescriptor(resourceId, groupId);
        return ResponseEntity.ok().body(result);
    }

    @PostMapping(value = "/EntityDescriptor", consumes = "application/xml")
    @Transactional
    public ResponseEntity<?> upload(@RequestBody byte[] entityDescriptorXml, @RequestParam String spName) throws Exception {
        return handleUploadingEntityDescriptorXml(entityDescriptorXml, spName);
    }

    @PostMapping(value = "/EntityDescriptor", consumes = "application/x-www-form-urlencoded")
    @Transactional
    public ResponseEntity<?> upload(@RequestParam String metadataUrl, @RequestParam String spName) throws Exception {
        try {
            byte[] xmlContents = this.restTemplate.getForObject(metadataUrl, byte[].class);
            return handleUploadingEntityDescriptorXml(xmlContents, spName);
        } catch (Throwable e) {
            log.error("Error fetching XML metadata from the provided URL: [{}]. The error is: {}", metadataUrl, e);
            log.error(e.getMessage(), e);
            return ResponseEntity
                    .badRequest()
                    .body(String.format("Error fetching XML metadata from the provided URL. Error: %s", e.getMessage()));
        }
    }
}