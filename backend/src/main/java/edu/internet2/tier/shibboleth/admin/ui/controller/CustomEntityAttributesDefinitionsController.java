package edu.internet2.tier.shibboleth.admin.ui.controller;

import java.util.List;

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
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor;
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
        CustomEntityAttributeDefinition cad = caService.find(definition.getName());
        
        if (cad != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(ServletUriComponentsBuilder.fromCurrentServletMapping().path("/api/custom/entity/attribute").build().toUri());
            
            return ResponseEntity.status(HttpStatus.CONFLICT).headers(headers)
                                 .body(new ErrorResponse(String.valueOf(HttpStatus.CONFLICT.value()), 
                                       String.format("The custom attribute definition with name: [%s] already exists.", definition.getName())));
        }
        
        CustomEntityAttributeDefinition result = caService.createOrUpdateDefinition(definition);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
   
    @PutMapping("/attribute")
    @Transactional
    public ResponseEntity<?> update(@RequestBody CustomEntityAttributeDefinition definition) {
        CustomEntityAttributeDefinition cad = caService.find(definition.getName());      
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

    @GetMapping("/attributes")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(caService.getAllDefinitions());
    }
    
    @GetMapping("/attribute/{name}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getOne(@PathVariable String name) {
        CustomEntityAttributeDefinition cad = caService.find(name);
        if (cad == null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(
                            ServletUriComponentsBuilder.fromCurrentServletMapping().path("/api/custom/entity/attribute/" + name).build().toUri());

            return ResponseEntity.status(HttpStatus.NOT_FOUND).headers(headers)
                            .body(new ErrorResponse(String.valueOf(HttpStatus.NOT_FOUND.value()),
                                  String.format("The custom attribute definition with name: [%s] does not already exist.", name)));
        }
        return ResponseEntity.ok(cad);
    }
    
    @DeleteMapping("/attribute/{name}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable String name) {
        CustomEntityAttributeDefinition cad = caService.find(name);
        if (cad == null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(
                            ServletUriComponentsBuilder.fromCurrentServletMapping().path("/api/custom/attribute/" + name).build().toUri());

            return ResponseEntity.status(HttpStatus.NOT_FOUND).headers(headers)
                            .body(new ErrorResponse(String.valueOf(HttpStatus.NOT_FOUND.value()),
                                  String.format("The custom attribute definition with name: [%s] does not already exist.", name)));
        }
        caService.deleteDefinition(cad);
        return ResponseEntity.noContent().build();
    }
}
