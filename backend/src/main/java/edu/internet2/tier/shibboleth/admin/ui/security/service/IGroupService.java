package edu.internet2.tier.shibboleth.admin.ui.security.service;

import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupDeleteException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupExistsConflictException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.InvalidGroupRegexException;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;

import java.util.List;

public interface IGroupService {

    Group createGroup(Group group) throws GroupExistsConflictException, InvalidGroupRegexException;

    void deleteDefinition(String resourceId) throws PersistentEntityNotFound, GroupDeleteException;

    void ensureAdminGroupExists();
    
    Group find(String resourceId);

    List<Group> findAll();

    Group updateGroup(Group g) throws PersistentEntityNotFound, InvalidGroupRegexException;

    boolean doesStringMatchGroupPattern(String groupId, String uri);
}