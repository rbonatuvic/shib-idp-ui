package edu.internet2.tier.shibboleth.admin.util;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlChainingMetadataResolver;
import org.opensaml.saml.metadata.resolver.MetadataResolver;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class OpenSamlChainingMetadataResolverUtil {

    public static void updateChainingMetadataResolver(OpenSamlChainingMetadataResolver chainingMetadataResolver, MetadataResolver openSamlResolver) {
        List<MetadataResolver> resolverList = new ArrayList<>(chainingMetadataResolver.getResolvers());
        resolverList.removeIf(resolver -> resolver.getId().equals(openSamlResolver.getId()));
        resolverList.add(openSamlResolver);
        chainingMetadataResolver.setResolvers(resolverList);
    }
}
