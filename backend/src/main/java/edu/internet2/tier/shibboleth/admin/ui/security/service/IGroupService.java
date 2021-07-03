package edu.internet2.tier.shibboleth.admin.ui.security.service;

import java.util.List;

import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupDeleteException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupExistsConflictException;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;

public interface IGroupService {

    Group createGroup(Group group) throws GroupExistsConflictException;

    void deleteDefinition(String resourceId) throws EntityNotFoundException, GroupDeleteException;

    Group find(String resourceId);

    List<Group> findAll();

    Group updateGroup(Group g) throws EntityNotFoundException;

}
