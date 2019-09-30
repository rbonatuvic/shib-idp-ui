package edu.internet2.tier.shibboleth.admin.ui.util

import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter

trait AttributeReleaseAndOverridesX {
    List<String> attributesRelease(int filterIndex) {
        (this.metadataFilters[filterIndex] as EntityAttributesFilter).attributeRelease
    }

    Map<String, Object> overrides() {
        (this.metadataFilters[filterIndex] as EntityAttributesFilter).relyingPartyOverrides
    }
}
