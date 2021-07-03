package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.versioning.Version;
import edu.internet2.tier.shibboleth.admin.ui.exception.EntityIdExistsException;
import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException;
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorVersionService;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityService;
import lombok.extern.slf4j.Slf4j;

import org.opensaml.core.xml.io.MarshallingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
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
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@Slf4j
public class EntityDescriptorController {
    static URI getResourceUriFor(String resourceId) {
        return ServletUriComponentsBuilder
                .fromCurrentServletMapping().path("/api/EntityDescriptor")
                .pathSegment(resourceId)
                .build()
                .toUri();
    }
    
    @Autowired
    private EntityDescriptorRepository entityDescriptorRepository;

    @Autowired
    private EntityDescriptorService entityDescriptorService;

    @Autowired
    private OpenSamlObjects openSamlObjects;

    private RestTemplate restTemplate;

    @Autowired
    RestTemplateBuilder restTemplateBuilder;

    private UserService userService;

    private EntityDescriptorVersionService versionService;

    public EntityDescriptorController(UserService userService, EntityDescriptorVersionService versionService) {
        this.userService = userService;
        this.versionService = versionService;
    }

    @PostMapping("/EntityDescriptor")
    @Transactional
    public ResponseEntity<?> create(@RequestBody EntityDescriptorRepresentation edRepresentation) throws ForbiddenException, EntityIdExistsException {
        EntityDescriptorRepresentation persistedEd = entityDescriptorService.createNew(edRepresentation);            
        return ResponseEntity.created(getResourceUriFor(persistedEd.getId())).body(persistedEd);
    }

    @Secured("ROLE_ADMIN")
    @DeleteMapping(value = "/EntityDescriptor/{resourceId}")
    @Transactional
    public ResponseEntity<?> deleteOne(@PathVariable String resourceId) throws ForbiddenException, EntityNotFoundException {
        EntityDescriptor ed = entityDescriptorService.getEntityDescriptorByResourceId(resourceId);
        if (ed.isServiceEnabled()) {
            throw new ForbiddenException("Deleting an enabled Metadata Source is not allowed. Disable the source and try again.");
        }
        entityDescriptorRepository.delete(ed);
        return ResponseEntity.noContent().build();
    }

    private ResponseEntity<?> existingEntityDescriptorCheck(String entityId) {
        final EntityDescriptor ed = entityDescriptorRepository.findByEntityID(entityId);
        if (ed != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(getResourceUriFor(ed.getResourceId()));
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .headers(headers)
                    .body(new ErrorResponse(String.valueOf(HttpStatus.CONFLICT.value()), String.format("The entity descriptor with entity id [%s] already exists.", entityId)));
        }
        //No existing entity descriptor, which is an OK condition indicated by returning a null conflict response
        return null;
    }

    @GetMapping("/EntityDescriptors")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAll() {
        try {
            return ResponseEntity.ok(entityDescriptorService.getAllRepresentationsBasedOnUserAccess());
        } catch (ForbiddenException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse(HttpStatus.FORBIDDEN, e.getMessage()));
        }
    }

    @GetMapping("/EntityDescriptor/{resourceId}/Versions")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAllVersions(@PathVariable String resourceId) {
        EntityDescriptor ed = entityDescriptorRepository.findByResourceId(resourceId);
        if (ed == null) {
            return ResponseEntity.notFound().build();
        }
        List<Version> versions = versionService.findVersionsForEntityDescriptor(resourceId);
        if (versions.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if(userService.isAuthorizedFor(ed.getCreatedBy(), ed.getGroup() == null ? null : ed.getGroup().getResourceId())) {
            return ResponseEntity.ok(versions);
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @Secured("ROLE_ADMIN")
    @Transactional(readOnly = true)
    @GetMapping(value = "/EntityDescriptor/disabledNonAdmin")
    public Iterable<EntityDescriptorRepresentation> getDisabledAndNotOwnedByAdmin() {
        return entityDescriptorRepository.findAllDisabledAndNotOwnedByAdmin()
                .map(ed -> entityDescriptorService.createRepresentationFromDescriptor(ed))
                .collect(Collectors.toList());
    }

    @GetMapping("/EntityDescriptor/{resourceId}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getOne(@PathVariable String resourceId) {
        User currentUser = userService.getCurrentUser();
        if (currentUser != null) {
            EntityDescriptor ed = entityDescriptorRepository.findByResourceId(resourceId);
            if (ed == null) {
                return ResponseEntity.notFound().build();
            } else {
                if (userService.isAuthorizedFor(ed.getCreatedBy(), ed.getGroup() == null ? null : ed.getGroup().getResourceId())) {
                    EntityDescriptorRepresentation edr = entityDescriptorService.createRepresentationFromDescriptor(ed);
                    return ResponseEntity.ok(edr);
                }
            }
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                        new ErrorResponse(HttpStatus.FORBIDDEN, "You are not authorized to perform the requested operation."));

    }

    @GetMapping(value = "/EntityDescriptor/{resourceId}", produces = "application/xml")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getOneXml(@PathVariable String resourceId) throws MarshallingException {
        User currentUser = userService.getCurrentUser();
        if (currentUser != null) {
            EntityDescriptor ed = entityDescriptorRepository.findByResourceId(resourceId);
            if (ed == null) {
                return ResponseEntity.notFound().build();
            } else {
                if (userService.isAuthorizedFor(ed.getCreatedBy(), ed.getGroup() == null ? null : ed.getGroup().getResourceId())) {
                    final String xml = this.openSamlObjects.marshalToXmlString(ed);
                    return ResponseEntity.ok(xml);
                }
            }
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();

    }

    @GetMapping("/EntityDescriptor/{resourceId}/Versions/{versionId}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getSpecificVersion(@PathVariable String resourceId, @PathVariable String versionId) {
        EntityDescriptorRepresentation edRepresentation = versionService.findSpecificVersionOfEntityDescriptor(resourceId, versionId);

        if (edRepresentation == null) {
            return ResponseEntity.notFound().build();
        }
        if(userService.isAuthorizedFor(edRepresentation.getCreatedBy(), edRepresentation.getGroupId())) {
            return ResponseEntity.ok(edRepresentation);
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @ExceptionHandler({ ForbiddenException.class })
    public void handleException() {
        //
    }
    
    private ResponseEntity<?> handleUploadingEntityDescriptorXml(byte[] rawXmlBytes, String spName) throws Exception {
        final EntityDescriptor ed = EntityDescriptor.class.cast(openSamlObjects.unmarshalFromXml(rawXmlBytes));

        ResponseEntity<?> existingEntityDescriptorConflictResponse = existingEntityDescriptorCheck(ed.getEntityID());
        if (existingEntityDescriptorConflictResponse != null) {
            return existingEntityDescriptorConflictResponse;
        }

        ed.setServiceProviderName(spName);
        final EntityDescriptor persistedEd = entityDescriptorRepository.save(ed);
        return ResponseEntity.created(getResourceUriFor(persistedEd.getResourceId()))
                .body(entityDescriptorService.createRepresentationFromDescriptor(persistedEd));
    }

    @PostConstruct
    public void initRestTemplate() {
        this.restTemplate = restTemplateBuilder.build();
    }

    @PutMapping("/EntityDescriptor/{resourceId}")
    @Transactional
    public ResponseEntity<?> update(@RequestBody EntityDescriptorRepresentation edRepresentation, @PathVariable String resourceId) throws ForbiddenException, ConcurrentModificationException, EntityNotFoundException {
        edRepresentation.setId(resourceId); // This should be the same already, but just to be safe...
        EntityDescriptorRepresentation result = entityDescriptorService.update(edRepresentation);
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
