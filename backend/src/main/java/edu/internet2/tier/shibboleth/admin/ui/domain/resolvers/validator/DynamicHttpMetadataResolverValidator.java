package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.validator;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;

public class DynamicHttpMetadataResolverValidator implements IMetadataResolverValidator {
    @Autowired IGroupService groupService;

    @Autowired UserService userService;

    public DynamicHttpMetadataResolverValidator(IGroupService groupService, UserService userService) {
        this.groupService = groupService;
        this.userService = userService;
    }

    @Override public boolean supports(MetadataResolver resolver) { return resolver instanceof DynamicHttpMetadataResolver; }

    @Override public ValidationResult validate(MetadataResolver resolver) {
        DynamicHttpMetadataResolver dynamicResolver = (DynamicHttpMetadataResolver) resolver;
        if ("MetadataQueryProtocol".equals(dynamicResolver.getMetadataRequestURLConstructionScheme().getType())) {
            String url = dynamicResolver.getMetadataRequestURLConstructionScheme().getContent();
            if (!groupService.doesUrlMatchGroupPattern(userService.getCurrentUser().getGroupId(), url)) {
                return new ValidationResult("Metadata Query Protocol URL not acceptable for user's group");
            }
        }
        return new ValidationResult();
    }
}