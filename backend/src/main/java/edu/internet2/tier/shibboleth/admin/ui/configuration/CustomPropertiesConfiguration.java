package edu.internet2.tier.shibboleth.admin.ui.configuration;

import edu.internet2.tier.shibboleth.admin.ui.domain.IRelyingPartyOverrideProperty;
import edu.internet2.tier.shibboleth.admin.ui.domain.RelyingPartyOverrideProperty;
import edu.internet2.tier.shibboleth.admin.ui.service.CustomEntityAttributesDefinitionService;
import edu.internet2.tier.shibboleth.admin.ui.service.ShibConfigurationService;
import edu.internet2.tier.shibboleth.admin.ui.service.events.CustomEntityAttributeDefinitionChangeEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
@ConfigurationProperties(prefix = "custom")
public class CustomPropertiesConfiguration implements ApplicationListener<CustomEntityAttributeDefinitionChangeEvent> {
    private List<? extends Map<String, String>> attributes = new ArrayList<>();

    private CustomEntityAttributesDefinitionService ceadService;

    private HashMap<String, IRelyingPartyOverrideProperty> overrides = new HashMap<>();

    private List<RelyingPartyOverrideProperty> overridesFromConfigFile = new ArrayList<>();

    private List<ShibConfigurationProperty> shibprops = new ArrayList<>();

    private ShibConfigurationService shibConfigurationService;

    private void buildRelyingPartyOverrides() {
        // Start over with a clean map and get the CustomEntityAttributesDefinitions from the DB
        HashMap<String, IRelyingPartyOverrideProperty> reloaded = new HashMap<>();
        ceadService.getAllDefinitions().forEach(def -> {
            def.updateExamplesList(); // totally non-ooo, but @PostLoad wasn't working and JPA/Hibernate is doing some reflection crap
            reloaded.put(def.getName(), def);
        });

        // We only want to add to an override from the config file if the incoming override (by name) isn't already in
        // the list of overrides (ie DB > file config)
        for (RelyingPartyOverrideProperty rpop : this.overridesFromConfigFile) {
            if (!reloaded.containsKey(rpop.getName())) {
                reloaded.put(rpop.getName(), rpop);
            }
        }
        
        this.overrides = reloaded;
    }

    public List<? extends Map<String, String>> getAttributes() {
        return attributes;
    }

    public List<IRelyingPartyOverrideProperty> getOverrides() {
        return new ArrayList<>(overrides.values());
    }

    /**
     * We don't know what change occurred, so the easiest thing to do is just rebuild our map of overrides.
     * (especially since the small occurrence of this and number of items makes doing this ok perf-wise).
     */
    @Override
    public void onApplicationEvent(CustomEntityAttributeDefinitionChangeEvent arg0) {
        buildRelyingPartyOverrides();
    }

    @PostConstruct
    public void postConstruct() {
        // Make sure we have the right data
        buildRelyingPartyOverrides();
        updateShibPropsDatabase();
    }

    public void setAttributes(List<? extends Map<String, String>> attributes) {
        this.attributes = attributes;
    }

    @Autowired
    public void setCeadService(CustomEntityAttributesDefinitionService ceadService) {
        this.ceadService = ceadService;
    }

    @Autowired
    public void setShibConfigurationService(ShibConfigurationService service) {
        this.shibConfigurationService = service;
    }

    /**
     * This setter will get used by Spring's property system to create objects from application.yml (should the properties exist)
     */
    public void setOverrides(List<RelyingPartyOverrideProperty> overridesFromConfigFile) {
        this.overridesFromConfigFile = overridesFromConfigFile;
    }

    /**
     * This setter will get used by Spring's property system to create objects from application.yml (should the properties exist)
     */
    public void setShibprops(List<ShibConfigurationProperty> props) {
        this.shibprops = props;
    }

    /**
     * Add any custom properties from the application.yml - any incoming property with the same name as an existing property will be
     * ignored (ie this will not update/replace information for existing properties). This shouldn't be considered standard, but
     * offers users the ability to add properties to their system from an addon module, new feature etc.
     */
    private void updateShibPropsDatabase() {
        List<String> existingPropNames = shibConfigurationService.getExistingPropertyNames();
        shibprops.forEach(prop -> {
            if (!existingPropNames.contains(prop.getPropertyName())) {
                shibConfigurationService.save(prop);
            }
        });
    }
}