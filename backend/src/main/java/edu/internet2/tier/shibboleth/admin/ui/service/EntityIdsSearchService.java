package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityIdsSearchResultRepresentation;
import net.andreinc.mockneat.MockNeat;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * API component responsible for entity ids search.
 */
@FunctionalInterface
public interface EntityIdsSearchService {

    /**
     * Find a list of entity ids
     * @param searchTerm for the query
     * @param limit optional limit of query results to return. Zero or less value indicates no limit.
     * @return EntityIdsSearchResultRepresentation
     */
    EntityIdsSearchResultRepresentation findBySearchTermAndOptionalLimit(String searchTerm, int limit);
}
