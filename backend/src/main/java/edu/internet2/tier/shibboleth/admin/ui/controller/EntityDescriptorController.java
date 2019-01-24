package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService;
import org.opensaml.core.xml.io.MarshallingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
import javax.xml.ws.Response;
import java.net.URI;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class EntityDescriptorController {

    @Autowired
    private EntityDescriptorRepository entityDescriptorRepository;

    @Autowired
    private OpenSamlObjects openSamlObjects;

    @Autowired
    private EntityDescriptorService entityDescriptorService;

    @Autowired
    RestTemplateBuilder restTemplateBuilder;

    private RestTemplate restTemplate;

    private static Logger LOGGER = LoggerFactory.getLogger(EntityDescriptorController.class);

    @PostConstruct
    public void initRestTemplate() {
        this.restTemplate = restTemplateBuilder.build();
    }

    @PostMapping("/EntityDescriptor")
    public ResponseEntity<?> create(@RequestBody EntityDescriptorRepresentation edRepresentation) {
        final String entityId = edRepresentation.getEntityId();

        ResponseEntity<?> existingEntityDescriptorConflictResponse = existingEntityDescriptorCheck(entityId);
        if (existingEntityDescriptorConflictResponse != null) {
            return existingEntityDescriptorConflictResponse;
        }

        EntityDescriptor ed = (EntityDescriptor) entityDescriptorService.createDescriptorFromRepresentation(edRepresentation);

        EntityDescriptor persistedEd = entityDescriptorRepository.save(ed);
        edRepresentation.setId(persistedEd.getResourceId());
        edRepresentation.setCreatedDate(persistedEd.getCreatedDate());
        return ResponseEntity.created(getResourceUriFor(persistedEd)).body(entityDescriptorService.createRepresentationFromDescriptor(persistedEd));
    }

    @PostMapping(value = "/EntityDescriptor", consumes = "application/xml")
    public ResponseEntity<?> upload(@RequestBody byte[] entityDescriptorXml, @RequestParam String spName) throws Exception {
        return handleUploadingEntityDescriptorXml(entityDescriptorXml, spName);
    }

    @PostMapping(value = "/EntityDescriptor", consumes = "application/x-www-form-urlencoded")
    public ResponseEntity<?> upload(@RequestParam String metadataUrl, @RequestParam String spName) throws Exception {
        try {
            byte[] xmlContents = this.restTemplate.getForObject(metadataUrl, byte[].class);
            return handleUploadingEntityDescriptorXml(xmlContents, spName);
        } catch (Throwable e) {
            LOGGER.error("Error fetching XML metadata from the provided URL: [{}]. The error is: {}", metadataUrl, e);
            LOGGER.error(e.getMessage(), e);
            return ResponseEntity
                    .badRequest()
                    .body(String.format("Error fetching XML metadata from the provided URL. Error: %s", e.getMessage()));
        }
    }

    @PutMapping("/EntityDescriptor/{resourceId}")
    public ResponseEntity<?> update(@RequestBody EntityDescriptorRepresentation edRepresentation, @PathVariable String resourceId) {
        EntityDescriptor existingEd = entityDescriptorRepository.findByResourceId(resourceId);
        if (existingEd == null) {
            return ResponseEntity.notFound().build();
        }

        // Verify we're the only one attempting to update the EntityDescriptor
        if (edRepresentation.getVersion() != existingEd.hashCode()) {
            return new ResponseEntity<Void>(HttpStatus.CONFLICT);
        }

        EntityDescriptor updatedEd =
                EntityDescriptor.class.cast(entityDescriptorService.createDescriptorFromRepresentation(edRepresentation));

        updatedEd.setAudId(existingEd.getAudId());
        updatedEd.setResourceId(existingEd.getResourceId());
        updatedEd.setCreatedDate(existingEd.getCreatedDate());

        updatedEd = entityDescriptorRepository.save(updatedEd);

        return ResponseEntity.ok().body(entityDescriptorService.createRepresentationFromDescriptor(updatedEd));
    }

    @GetMapping("/EntityDescriptors")
    @Transactional(readOnly = true)
    public Iterable<EntityDescriptorRepresentation> getAll() {
        return entityDescriptorRepository.findAllByCustomQueryAndStream()
                .map(ed -> entityDescriptorService.createRepresentationFromDescriptor(ed))
                .collect(Collectors.toList());
    }

    @GetMapping("/EntityDescriptor/{resourceId}")
    public ResponseEntity<?> getOne(@PathVariable String resourceId) {
        EntityDescriptor ed = entityDescriptorRepository.findByResourceId(resourceId);
        if (ed == null) {
            return ResponseEntity.notFound().build();
        }
        EntityDescriptorRepresentation edr = entityDescriptorService.createRepresentationFromDescriptor(ed);

        return ResponseEntity.ok(edr);
    }

    @GetMapping(value = "/EntityDescriptor/{resourceId}", produces = "application/xml")
    public ResponseEntity<?> getOneXml(@PathVariable String resourceId) throws MarshallingException {
        EntityDescriptor ed = entityDescriptorRepository.findByResourceId(resourceId);
        if (ed == null) {
            return ResponseEntity.notFound().build();
        }
        final String xml = this.openSamlObjects.marshalToXmlString(ed);

        return ResponseEntity.ok(xml);
    }

    @Transactional
    @GetMapping(value = "/EntityDescriptor/disabledNonAdmin")
    public Iterable<EntityDescriptorRepresentation> getDisabledAndNotOwnedByAdmin() {
        return entityDescriptorRepository.findAllDisabledAndNotOwnedByAdmin()
                .map(ed -> entityDescriptorService.createRepresentationFromDescriptor(ed))
                .collect(Collectors.toList());
    }

    @Secured("ROLE_ADMIN")
    @DeleteMapping(value = "/EntityDescriptor/{resourceId}")
    public ResponseEntity<?> deleteOne(@PathVariable String resourceId) {
        EntityDescriptor ed = entityDescriptorRepository.findByResourceId(resourceId);
        if (ed == null) {
            return ResponseEntity.notFound().build();
        } else if (ed.isServiceEnabled()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse(HttpStatus.FORBIDDEN, "Deleting an enabled Metadata Source is not allowed. Disable the source and try again."));
        } else {
            entityDescriptorRepository.delete(ed);
            return ResponseEntity.noContent().build();
        }
    }

    private static URI getResourceUriFor(EntityDescriptor ed) {
        return ServletUriComponentsBuilder
                .fromCurrentServletMapping().path("/api/EntityDescriptor")
                .pathSegment(ed.getResourceId())
                .build()
                .toUri();
    }

    private ResponseEntity<?> existingEntityDescriptorCheck(String entityId) {
        final EntityDescriptor ed = entityDescriptorRepository.findByEntityID(entityId);
        if (ed != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(getResourceUriFor(ed));
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .headers(headers)
                    .body(new ErrorResponse(String.valueOf(HttpStatus.CONFLICT.value()), String.format("The entity descriptor with entity id [%s] already exists.", entityId)));
        }
        //No existing entity descriptor, which is an OK condition indicated by returning a null conflict response
        return null;
    }

    private ResponseEntity<?> handleUploadingEntityDescriptorXml(byte[] rawXmlBytes, String spName) throws Exception {
        final EntityDescriptor ed = EntityDescriptor.class.cast(openSamlObjects.unmarshalFromXml(rawXmlBytes));

        ResponseEntity<?> existingEntityDescriptorConflictResponse = existingEntityDescriptorCheck(ed.getEntityID());
        if (existingEntityDescriptorConflictResponse != null) {
            return existingEntityDescriptorConflictResponse;
        }

        ed.setServiceProviderName(spName);
        final EntityDescriptor persistedEd = entityDescriptorRepository.save(ed);
        return ResponseEntity.created(getResourceUriFor(persistedEd))
                .body(entityDescriptorService.createRepresentationFromDescriptor(persistedEd));
    }
}
