package edu.internet2.tier.shibboleth.admin.util;

import edu.internet2.tier.shibboleth.admin.ui.service.TokenPlaceholderValueResolvingService;

public class TokenPlaceholderResolvers {
    
    private static TokenPlaceholderValueResolvingService placeholderResolverService;

    public TokenPlaceholderResolvers(TokenPlaceholderValueResolvingService service) {
        TokenPlaceholderResolvers.placeholderResolverService = service;
    }

    public static TokenPlaceholderValueResolvingService placeholderResolverService() {
        return placeholderResolverService;
    }
}
