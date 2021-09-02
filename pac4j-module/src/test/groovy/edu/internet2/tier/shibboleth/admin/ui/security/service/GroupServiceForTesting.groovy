package edu.internet2.tier.shibboleth.admin.ui.security.service

import org.springframework.transaction.annotation.Transactional

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