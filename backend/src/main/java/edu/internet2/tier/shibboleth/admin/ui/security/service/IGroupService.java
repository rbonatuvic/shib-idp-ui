package edu.internet2.tier.shibboleth.admin.ui.security.service;

import java.util.List;

import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;

public interface IGroupService {

    Group createOrUpdateGroup(Group g);

    void deleteDefinition(Group g);

    Group find(String resourceId);

    List<Group> findAll();

}
