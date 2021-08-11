package edu.internet2.tier.shibboleth.admin.ui.security.model.listener;

import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;

public interface ILazyLoaderHelper {
    default public void loadOwnedItems(Group g) { }

    default public void loadGroups(User u) { }
}