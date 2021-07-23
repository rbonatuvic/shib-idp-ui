package edu.internet2.tier.shibboleth.admin.ui.security.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.model.UserGroup;
import edu.internet2.tier.shibboleth.admin.ui.security.model.UserGroupKey;

public interface UserGroupRepository extends JpaRepository<UserGroup, UserGroupKey> {
    
    List<UserGroup> findAllByUser(User user);

    List<UserGroup> findAllByGroup(Group group);
}
