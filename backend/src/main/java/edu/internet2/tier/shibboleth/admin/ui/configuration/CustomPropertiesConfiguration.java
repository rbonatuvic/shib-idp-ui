package edu.internet2.tier.shibboleth.admin.ui.configuration;

import edu.internet2.tier.shibboleth.admin.ui.domain.IRelyingPartyOverrideProperty;
import edu.internet2.tier.shibboleth.admin.ui.domain.RelyingPartyOverrideProperty;
import edu.internet2.tier.shibboleth.admin.ui.service.CustomEntityAttributesDefinitionService;
import edu.internet2.tier.shibboleth.admin.ui.service.ICustomEntityAttributesDefinitionListener;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

@Configuration
@ConfigurationProperties(prefix = "custom")
public class CustomPropertiesConfiguration implements ICustomEntityAttributesDefinitionListener {
    private List<? extends Map<String, String>> attributes = new ArrayList<>();
    
    private CustomEntityAttributesDefinitionService ceadService;

    private HashMap<String, IRelyingPartyOverrideProperty> overrides = new HashMap<>();
    
    private List<RelyingPartyOverrideProperty> overridesFromConfigFile = new ArrayList<>();
    
    private void buildRelyingPartyOverrides() {
        // Start over with a clean map and get the CustomEntityAttributesDefinitions from the DB
        overrides = new HashMap<>();
        ceadService.getAllDefinitions().forEach(def -> overrides.put(def.getName(), def));
        
        // We only want to add to an override from the config file if the incoming override (by name) isn't already in 
        // the list of overrides (ie DB > file config)
        for(RelyingPartyOverrideProperty rpop : this.overridesFromConfigFile) {
            if (!this.overrides.containsKey(rpop.getName())) {
                this.overrides.put(rpop.getName(), rpop);
            }
        }
    }

    /**
     * We don't know what change occurred, so the easiest thing to do is just rebuild our map of overrides.
     * (especially since the small occurrence of this and number of items makes doing this ok perf-wise).
     */
    @Override
    public void customEntityAttributesDefinitionChangeOccurred() {
        buildRelyingPartyOverrides();
    }

    public List<? extends Map<String, String>> getAttributes() {
        return attributes;
    }   
    
    public List<IRelyingPartyOverrideProperty> getOverrides() {
        return new ArrayList<>(overrides.values());        
    }

    @PostConstruct
    public void postConstruct() {
        // Register with service to get the updates when changes are made to the DB definitions
        ceadService.addCustomEntityAttributesDefinitionListener(this);
        
        // Make sure we have the right data
        buildRelyingPartyOverrides();
    }
    
    public void setAttributes(List<? extends Map<String, String>> attributes) {
        this.attributes = attributes;
    }

    @Autowired
    public void setCeadService(CustomEntityAttributesDefinitionService ceadService) {
        this.ceadService = ceadService;
    }

    /**
     * This setter will get used by Spring's property system to create objects from a config file (should the properties exist)
     */
    public void setOverrides(List<RelyingPartyOverrideProperty> overridesFromConfigFile) {
        this.overridesFromConfigFile = overridesFromConfigFile;
    }
}
