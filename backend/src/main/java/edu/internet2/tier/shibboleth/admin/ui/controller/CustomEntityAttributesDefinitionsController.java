package edu.internet2.tier.shibboleth.admin.ui.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import edu.internet2.tier.shibboleth.admin.ui.domain.CustomEntityAttributeDefinition;
import edu.internet2.tier.shibboleth.admin.ui.service.CustomEntityAttributesDefinitionService;

@Controller
@RequestMapping(value = "/api/custom/entity")
public class CustomEntityAttributesDefinitionsController {
    @Autowired
    private CustomEntityAttributesDefinitionService caService;

    @PostMapping("/attribute")
    @Transactional
    public ResponseEntity<?> create(@RequestBody CustomEntityAttributeDefinition definition) {
        // If already defined, we can't create a new one, nor will this call update the definition
        CustomEntityAttributeDefinition cad = caService.find(definition.getResourceId());
        
        if (cad != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(ServletUriComponentsBuilder.fromCurrentServletMapping().path("/api/custom/entity/attribute").build().toUri());
            
            return ResponseEntity.status(HttpStatus.CONFLICT).headers(headers)
                                 .body(new ErrorResponse(String.valueOf(HttpStatus.CONFLICT.value()), 
                                       String.format("The custom attribute definition already exists - unable to create a new definition")));
        }
        
        CustomEntityAttributeDefinition result = caService.createOrUpdateDefinition(definition);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
   
    @PutMapping("/attribute")
    @Transactional
    public ResponseEntity<?> update(@RequestBody CustomEntityAttributeDefinition definition) {
        CustomEntityAttributeDefinition cad = caService.find(definition.getResourceId());      
        if (cad == null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(ServletUriComponentsBuilder.fromCurrentServletMapping().path("/api/custom/entity/attribute").build().toUri());
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).headers(headers)
                                 .body(new ErrorResponse(String.valueOf(HttpStatus.NOT_FOUND.value()), 
                                       String.format("The custom attribute definition with name: [%s] does not already exist.", definition.getName())));
        }
        
        CustomEntityAttributeDefinition result = caService.createOrUpdateDefinition(definition);
        return ResponseEntity.ok(result);
    }

    /**
     * @return List of IRelyingPartyOverrideProperty objects. This will include all of the CustomEntityAttributeDefinition
     * and the RelyingPartyOverrideProperties from any configuration file that was read in at startup.
     */
    @GetMapping("/attributes")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(caService.getAllDefinitions());
    }
    
    @GetMapping("/attribute/{resourceId}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getOne(@PathVariable String resourceId) {
        CustomEntityAttributeDefinition cad = caService.find(resourceId);
        if (cad == null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(
                            ServletUriComponentsBuilder.fromCurrentServletMapping().path("/api/custom/entity/attribute/" + resourceId).build().toUri());

            return ResponseEntity.status(HttpStatus.NOT_FOUND).headers(headers)
                            .body(new ErrorResponse(String.valueOf(HttpStatus.NOT_FOUND.value()),
                                  String.format("The custom attribute definition with resource id: [%s] does not already exist.", resourceId)));
        }
        return ResponseEntity.ok(cad);
    }
    
    @DeleteMapping("/attribute/{resourceId}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable String resourceId) {
        CustomEntityAttributeDefinition cad = caService.find(resourceId);
        if (cad == null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(
                            ServletUriComponentsBuilder.fromCurrentServletMapping().path("/api/custom/entity/attribute/" + resourceId).build().toUri());

            return ResponseEntity.status(HttpStatus.NOT_FOUND).headers(headers)
                            .body(new ErrorResponse(String.valueOf(HttpStatus.NOT_FOUND.value()),
                                  String.format("The custom attribute definition with resource id: [%s] does not already exist.", resourceId)));
        }
        caService.deleteDefinition(cad);
        return ResponseEntity.noContent().build();
    }
}
