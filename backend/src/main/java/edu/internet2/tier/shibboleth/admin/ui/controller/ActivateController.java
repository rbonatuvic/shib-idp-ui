package edu.internet2.tier.shibboleth.admin.ui.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;

@RestController
@RequestMapping("/api/activate")
public class ActivateController {
    @Autowired
    private UserService userService;
    
    @Autowired
    private EntityDescriptorRepository entityDescriptorRepo;
    
    
    
    
// Enable/disable for : entity descriptor, provider, filter
}
