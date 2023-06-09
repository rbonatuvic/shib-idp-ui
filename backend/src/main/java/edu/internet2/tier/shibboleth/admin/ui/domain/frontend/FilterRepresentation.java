package edu.internet2.tier.shibboleth.admin.ui.domain.frontend;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class FilterRepresentation implements Serializable {
    private String id;
    private String filterName;
    private boolean filterEnabled;
    private FilterTargetRepresentation filterTarget;
    private Map<String, Object> relyingPartyOverrides;
    private List<String> attributeRelease;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
    private int version;

    public FilterRepresentation() {

    }

    public FilterRepresentation(String id, String filterName, boolean filterEnabled) {
        this.id = id;
        this.filterName = filterName;
        this.filterEnabled = filterEnabled;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFilterName() {
        return filterName;
    }

    public void setFilterName(String filterName) {
        this.filterName = filterName;
    }

    public boolean isFilterEnabled() {
        return filterEnabled;
    }

    public void setFilterEnabled(boolean filterEnabled) {
        this.filterEnabled = filterEnabled;
    }

    public FilterTargetRepresentation getFilterTarget() {
        return filterTarget;
    }

    public void setFilterTarget(FilterTargetRepresentation filterTarget) {
        this.filterTarget = filterTarget;
    }

    public Map<String, Object> getRelyingPartyOverrides() {
        return relyingPartyOverrides;
    }

    public void setRelyingPartyOverrides(Map<String, Object> relyingPartyOverrides) {
        this.relyingPartyOverrides = relyingPartyOverrides;
    }

    public List<String> getAttributeRelease() {
        return attributeRelease;
    }

    public void setAttributeRelease(List<String> attributeRelease) {
        this.attributeRelease = attributeRelease;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDateTime getModifiedDate() {
        return modifiedDate;
    }

    public void setModifiedDate(LocalDateTime modifiedDate) {
        this.modifiedDate = modifiedDate;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }
}
