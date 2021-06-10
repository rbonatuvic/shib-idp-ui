package edu.internet2.tier.shibboleth.admin.ui.service.events;

import org.springframework.context.ApplicationEvent;

/**
 * The event could be any operation (new, update, delete).
 */
public class CustomEntityAttributeDefinitionChangeEvent extends ApplicationEvent {
    private static final long serialVersionUID = 1L;

    public CustomEntityAttributeDefinitionChangeEvent(Object source) {
        super(source);
    }

}
