package edu.internet2.tier.shibboleth.admin.ui.i18n;

import org.springframework.context.support.ResourceBundleMessageSource;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class MappedResourceBundleMessageSource extends ResourceBundleMessageSource {
    public Map<String, String> getMessagesMap(Locale locale) {
        ResourceBundle resourceBundle = this.doGetBundle("i18n/messages", locale);
        Map<String, String> messagesMap = new HashMap<>();
        Enumeration bundleKeys = resourceBundle.getKeys();

        while (bundleKeys.hasMoreElements()) {
            String key = (String)bundleKeys.nextElement();
            String value = resourceBundle.getString(key);
            messagesMap.put(key, value);
        }

        return messagesMap;
    }
}
