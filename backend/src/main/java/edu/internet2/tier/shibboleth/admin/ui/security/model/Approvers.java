package edu.internet2.tier.shibboleth.admin.ui.security.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Transient;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity(name = "approvers")
public class Approvers {
    @Id
    @Column(name = "resource_id")
    @JsonIgnore
    private String resourceId = UUID.randomUUID().toString();

    @ManyToMany
    @JsonIgnore
    private List<Group> approverGroups = new ArrayList<>();

    @Transient
    private List<String> approverGroupIds = new ArrayList<>();

    public List<String> getApproverGroupIds() {
        if (approverGroupIds.isEmpty()) {
            approverGroups.forEach(group -> approverGroupIds.add(group.getResourceId()));
        }
        return approverGroupIds;
    }

    public void setApproverGroups(List<Group> appGroups) {
        this.approverGroups = appGroups;
    }
}