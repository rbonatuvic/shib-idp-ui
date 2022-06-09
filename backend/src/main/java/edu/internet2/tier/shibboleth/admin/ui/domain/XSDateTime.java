package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;
import org.joda.time.DateTime;
import org.joda.time.chrono.ISOChronology;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.persistence.Entity;
import javax.persistence.Transient;
import java.time.Instant;

@Entity
@EqualsAndHashCode(callSuper = true)
@Audited
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
    public Instant getValue() {
        return Instant.ofEpochMilli(this.dateTime.getMillis());
    }

    @Override
    public void setValue(@Nullable Instant newValue) {
        this.dateTime = new DateTime(newValue.toEpochMilli());
    }

    @Nonnull
    public DateTimeFormatter getDateTimeFormatter() {
        return this.dateTimeFormatter;
    }

    public void setDateTimeFormatter(@Nonnull DateTimeFormatter newFormatter) {
        this.dateTimeFormatter = newFormatter;
    }
}