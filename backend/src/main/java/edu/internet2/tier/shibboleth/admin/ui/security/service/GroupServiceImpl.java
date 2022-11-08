package edu.internet2.tier.shibboleth.admin.ui.security.service;

import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupDeleteException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupExistsConflictException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.InvalidGroupRegexException;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Approvers;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.ApproversRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@NoArgsConstructor
public class GroupServiceImpl implements IGroupService {
    private static final String CHECK_REGEX = "function isValid(exp){try{new RegExp(exp);return true;}catch(e){return false;}};isValid(rgx);";
    private static final String REGEX_MATCHER = "function validate(r, s){ return RegExp(r).test(s);};validate(rgx, str);";
    private final ScriptEngine engine = new ScriptEngineManager().getEngineByName("JavaScript");

    @Autowired
    protected ApproversRepository approversRepository;

    @Autowired
    protected GroupsRepository groupRepository;

    @Autowired
    protected OwnershipRepository ownershipRepository;

    @Override
    @Transactional
    public Group createGroup(Group group) throws GroupExistsConflictException, InvalidGroupRegexException {
        // If already defined, we don't want to create a new one, nor do we want this call update the definition
        if (groupRepository.existsById(group.getResourceId())) {
            throw new GroupExistsConflictException(String.format("Call update (PUT) to modify the group with resource id: [%s] and name: [%s]", group.getResourceId(), group.getName()));
        }
        validateGroupRegex(group);
        manageApproversList(group);
        return groupRepository.save(group);
    }

    @Override
    @Transactional
    public void deleteDefinition(String resourceId) throws PersistentEntityNotFound, GroupDeleteException {
        Group group = find(resourceId);
        if (!ownershipRepository.findAllByOwner(group).isEmpty()) {
            throw new GroupDeleteException(String.format(
                            "Unable to delete group with resource id: [%s] - remove all items owned by / associated with the group first",
                            resourceId));
        }
        approversRepository.deleteAll(group.getApproversList());
        groupRepository.delete(group);
    }

    /**
     * Though the name URI is used here, any string value that we want to validate against the group's regex is accepted and checked.
     * Designed usage is that this would be a URL or an entity Id (which is a URI that does not have to follow the URL conventions)
     */
    @Override
    public boolean doesStringMatchGroupPattern(String groupId, String uri) {
        if (Group.ADMIN_GROUP.getResourceId().equals(groupId)) {
            return true;
        }
        Group group = find(groupId);

        String regExp = group.getValidationRegex();
        if (StringUtils.isEmpty(regExp)) {
            return true;
        }

        engine.put("str", uri);
        try {
            engine.put("rgx", regExp );
            Object value = engine.eval(REGEX_MATCHER);
            return Boolean.valueOf(value.toString());
        }
        catch (ScriptException e) {
            return false;
        }

    }

    @Override
    @Transactional
    public void ensureAdminGroupExists() {
        Group g = groupRepository.findByResourceId("admingroup");
        if (g == null) {
            g = new Group();
            g.setName("ADMIN-GROUP");
            g.setResourceId("admingroup");
            g.setValidationRegex(Group.DEFAULT_REGEX);
            g = groupRepository.save(g);
        }
        Group.ADMIN_GROUP = g;
    }

    @Override
    @Transactional
    public Group find(String resourceId) {
        return groupRepository.findByResourceId(resourceId);
    }

    @Override
    public List<Group> findAll() {
        return groupRepository.findAll();
    }

    private List<Group> getGroupListFromIds(List<String> approverGroupIds) {
        List<Group> result = new ArrayList<>();
        for (String id : approverGroupIds) {
            Group g = find(id);
            result.add(g);
        }
        return result;
    }

    private void manageApproversList(Group group) {
        AtomicInteger approversCount = new AtomicInteger();
        group.getApproversList().forEach(a -> approversCount.addAndGet(a.getApproverGroupIds().size()));
        if (approversCount.intValue() == 0) {
            List<String> ids = approversRepository.getApproverIdsForGroup(group.getResourceId());
            groupRepository.clearApproversForGroup(group.getResourceId());
            approversRepository.deleteAllById(ids);
            group.setApproversList(new ArrayList<>());
            return;
        }
        List<Approvers> updatedApprovers = new ArrayList<>();
        group.getApproversList().forEach(approvers -> {
            Approvers savedApprovers = approversRepository.findByResourceId(approvers.getResourceId());
            savedApprovers = savedApprovers == null ? approversRepository.save(approvers) : savedApprovers;
            savedApprovers.setApproverGroups(getGroupListFromIds(approvers.getApproverGroupIds()));
            Approvers updatedApp = approversRepository.save(savedApprovers);
            updatedApprovers.add(updatedApp);
        });
        group.setApproversList(updatedApprovers);
    }

    @Override
    public Group updateGroup(Group group) throws PersistentEntityNotFound, InvalidGroupRegexException {
        manageApproversList(group); // have to make sure that approvers have been saved before a fetch or we can get data integrity errors on lookup...
        Group g = find(group.getResourceId());
        if (g == null) {
            throw new PersistentEntityNotFound(String.format("Unable to find group with resource id: [%s] and name: [%s]",
                            group.getResourceId(), group.getName()));
        }
        validateGroupRegex(group);
        Group result = groupRepository.save(group);
        return result;
    }

    /**
     * If the regex is blank simply return
     */
    private void validateGroupRegex(Group group) throws InvalidGroupRegexException {
        if (StringUtils.isEmpty(group.getValidationRegex())) {
            return;
        }
        try {
            engine.put("rgx", group.getValidationRegex());
            Object value = engine.eval(CHECK_REGEX);
            if (!Boolean.valueOf(value.toString())) {
                throw new InvalidGroupRegexException("Invalid Regular Expression [ " + group.getValidationRegex() + " ]");
            }
        }
        catch (ScriptException e) {
            throw new InvalidGroupRegexException("Invalid Regular Expression [ " + group.getValidationRegex() + " ]");
        }
    }
}