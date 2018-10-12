package edu.internet2.tier.shibboleth.admin.ui.opensaml.config;

import org.opensaml.core.config.InitializationException;
import org.opensaml.core.config.Initializer;

import java.util.ServiceLoader;

//TODO: this is a crutch until a better way of skipping something is available
public class InitializationService {

    protected InitializationService() {
    }

    public static synchronized void initialize() throws InitializationException {
        final ServiceLoader<Initializer> serviceLoader = ServiceLoader.load(Initializer.class);
        for (Initializer initializer : serviceLoader) {
            if (
                    initializer.getClass().equals(org.opensaml.saml.config.impl.XMLObjectProviderInitializer.class)
                            || initializer.getClass().equals(org.opensaml.core.xml.config.XMLObjectProviderInitializer.class)
                            || initializer.getClass().equals(org.opensaml.xmlsec.config.impl.XMLObjectProviderInitializer.class)
            ) {
                continue;
            }
            initializer.init();
        }
    }
}
