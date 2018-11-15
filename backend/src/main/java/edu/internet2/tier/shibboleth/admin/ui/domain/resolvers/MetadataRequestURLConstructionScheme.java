package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Transient;
import java.util.HashMap;
import java.util.Map;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@Entity
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "@type", visible = true)
@JsonSubTypes({@JsonSubTypes.Type(value=MetadataQueryProtocolScheme.class, name="MetadataQueryProtocol"),
               @JsonSubTypes.Type(value=TemplateScheme.class, name="Template"),
               @JsonSubTypes.Type(value=RegexScheme.class, name="Regex")})
public abstract class MetadataRequestURLConstructionScheme extends AbstractAuditable {
    public enum SchemeType {
        METADATA_QUERY_PROTOCOL("MetadataQueryProtocol"),
        TEMPLATE("Template"),
        REGEX("Regex");

        private String schemeType;
        private static final Map<String, SchemeType> lookup = new HashMap<>();

        static {
            for (SchemeType schemeType : SchemeType.values()) {
                lookup.put(schemeType.toString(), schemeType);
            }
        }

        SchemeType(String schemeType) {
            this.schemeType = schemeType;
        }

        public static SchemeType get(String schemeType) {
            return lookup.get(schemeType);
        }

        @Override
        public String toString() {
            return schemeType;
        }
    }

    @JsonProperty("@type")
    @Transient
    String type;

    String content;
}
