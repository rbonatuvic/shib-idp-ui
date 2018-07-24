package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

/**
 * This is a persistent entity abstraction encapsulating a collection of metadata resolver ids
 * for the purpose of maintaining an order of all persistent metadata resolvers which becomes significant during
 * generation of XML metadata for the resolvers.
 *
 * Maintaining this separate entity enables UI layer for example to explicitly manipulate ordering e.g. use REST
 * API to reorder resolvers, etc.
 *
 * @author Dmitriy
 */
public class MetadataResolversOrderContainer {
}
