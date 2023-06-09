package edu.internet2.tier.shibboleth.admin.ui.security.service

import org.springframework.context.annotation.Profile
import org.springframework.transaction.annotation.Transactional

@Profile('test')
class GroupServiceForTesting extends GroupServiceImpl {   
    GroupServiceForTesting(GroupServiceImpl impl) {
        this.groupRepository = impl.groupRepository
        this.ownershipRepository = impl.ownershipRepository
    }
    
    @Transactional
    void clearAllForTesting() {
        approversRepository.deleteAll()
        groupRepository.deleteAll()
        ownershipRepository.clearAllOwnedByGroup()
        ensureAdminGroupExists()
    }
}