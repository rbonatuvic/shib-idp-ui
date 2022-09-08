package edu.internet2.tier.shibboleth.admin.util;

import org.apache.commons.lang3.StringUtils;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class EmptyStringToNullConverter implements AttributeConverter<String, String> {
    @Override
    public String convertToDatabaseColumn(String string) {
        // if whitespace is set on a value, send null to the db
        return StringUtils.defaultIfBlank(string, null);
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        // keep nulls from the db as nulls
        return dbData;
    }
}