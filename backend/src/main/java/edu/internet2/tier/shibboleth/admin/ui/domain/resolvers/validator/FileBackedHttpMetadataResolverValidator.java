package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.validator;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;

public class FileBackedHttpMetadataResolverValidator implements IMetadataResolverValidator {
    @Autowired
    private IGroupService groupService;

    @Autowired
    private UserService userService;

    public FileBackedHttpMetadataResolverValidator(IGroupService groupService, UserService userService) {
        this.groupService = groupService;
        this.userService = userService;
    }

    @Override public boolean supports(MetadataResolver resolver) { return resolver instanceof FileBackedHttpMetadataResolver; }

    @Override public ValidationResult validate(MetadataResolver resolver) {
        FileBackedHttpMetadataResolver fbhmResolver = (FileBackedHttpMetadataResolver) resolver;
        String url = fbhmResolver.getMetadataURL();
        if (!groupService.doesStringMatchGroupPattern(userService.getCurrentUser().getGroupId(), url)) {
            return new ValidationResult("Metadata URL not acceptable for user's group");
        }
        return new ValidationResult();
    }
}