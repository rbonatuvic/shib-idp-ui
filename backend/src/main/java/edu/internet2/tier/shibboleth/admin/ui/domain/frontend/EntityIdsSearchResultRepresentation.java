package edu.internet2.tier.shibboleth.admin.ui.domain.frontend;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class EntityIdsSearchResultRepresentation implements Serializable {

    private static final long serialVersionUID = 8150816733364873026L;

    private List<String> entityIds = new ArrayList<>();

    public EntityIdsSearchResultRepresentation(List<String> entityIds) {
        this.entityIds = entityIds;
    }

    public List<String> getEntityIds() {
        return Collections.unmodifiableList(entityIds);
    }
}
