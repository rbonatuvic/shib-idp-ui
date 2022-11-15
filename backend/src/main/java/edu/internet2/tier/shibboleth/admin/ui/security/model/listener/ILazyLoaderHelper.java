package edu.internet2.tier.shibboleth.admin.ui.security.model.listener;

import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;

public interface ILazyLoaderHelper {
    default void loadApproveForList(Group group) { }

    default void loadOwnedItems(Group g) { }

    default void loadGroups(User u) { }
}