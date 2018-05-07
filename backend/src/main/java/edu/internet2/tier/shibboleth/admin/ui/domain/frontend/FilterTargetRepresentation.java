package edu.internet2.tier.shibboleth.admin.ui.domain.frontend;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import edu.internet2.tier.shibboleth.admin.util.FilterTargetRepresentationDeserializer;

import java.util.ArrayList;
import java.util.List;

@JsonDeserialize(using = FilterTargetRepresentationDeserializer.class)
public class FilterTargetRepresentation {
    private String type;
    private List<String> value;
    private int version;

    public FilterTargetRepresentation() {

    }

    public FilterTargetRepresentation(String type, String value) {
        this.type = type;
        List<String> values = new ArrayList<>();
        values.add(value);
        this.value = values;
    }

    public FilterTargetRepresentation(String type, List<String> listValue) {
        this.type = type;
        this.value = listValue;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setValue(String value) {
        List<String> values = new ArrayList<>();
        values.add(value);
        this.value = values;
    }

    public List<String> getValue() {
        return value;
    }

    public void setValue(List<String> listValue) {
        this.value = listValue;
    }

    public void setVersion(int version) {
        this.version = version;
    }
}
