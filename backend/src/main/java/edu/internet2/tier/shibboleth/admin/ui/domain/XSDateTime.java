package edu.internet2.tier.shibboleth.admin.ui.domain;

import org.joda.time.DateTime;
import org.joda.time.chrono.ISOChronology;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.persistence.Entity;
import javax.persistence.Transient;

@Entity
public class XSDateTime extends AbstractXMLObject implements org.opensaml.core.xml.schema.XSDateTime {

    private DateTime dateTime;

    @Transient
    private DateTimeFormatter dateTimeFormatter;

    protected XSDateTime() {
        this.dateTimeFormatter = ISODateTimeFormat.dateTime().withChronology(ISOChronology.getInstanceUTC());
    }

    @Nullable
    @Override
    //TODO: find good way to persist
    public DateTime getValue() {
        return this.dateTime;
    }

    @Override
    public void setValue(@Nullable DateTime newValue) {
        this.dateTime = newValue;
    }

    @Nonnull
    @Override
    public DateTimeFormatter getDateTimeFormatter() {
        return this.dateTimeFormatter;
    }

    @Override
    public void setDateTimeFormatter(@Nonnull DateTimeFormatter newFormatter) {
        this.dateTimeFormatter = newFormatter;
    }
}
