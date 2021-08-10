package edu.internet2.tier.shibboleth.admin.ui.security.service

import org.springframework.context.annotation.Profile
import org.springframework.transaction.annotation.Transactional

import edu.internet2.tier.shibboleth.admin.ui.security.service.GroupServiceImpl

@Profile('test')
class GroupServiceForTesting extends GroupServiceImpl {   
    public GroupServiceForTesting(GroupServiceImpl impl) {
        this.groupRepository = impl.groupRepository
        this.ownershipRepository = impl.ownershipRepository
    }
    
    @Transactional
    public void clearAllForTesting() {
        groupRepository.deleteAll();
        ownershipRepository.clearAllOwnedByGroup()
        ensureAdminGroupExists()
    }
}
