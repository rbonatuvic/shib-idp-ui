package edu.internet2.tier.shibboleth.admin.ui.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.envers.Audited;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@EqualsAndHashCode(exclude = {"current"})
@Audited
public abstract class AbstractAuditable implements Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    protected Long id;

    @CreationTimestamp
    @CreatedDate
    @Column(nullable = false, updatable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS")
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @LastModifiedDate
    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS")
    private LocalDateTime modifiedDate;

    @Column(name = "created_by")
    @CreatedBy
    private String createdBy;

    @Column(name = "modified_by")
    @LastModifiedBy
    private String modifiedBy;

    @Transient
    @JsonProperty
    private boolean current;

    @Override
    public Long getAudId() {
        return id;
    }

    @Override
    public void setAudId(@NotNull Long id) {
        this.id = id;
    }

    @Override
    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    @Override
    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate == null ? null : createdDate.truncatedTo(ChronoUnit.NANOS);
    }

    @Override
    public LocalDateTime getModifiedDate() {
        return modifiedDate;
    }

    @Override
    public void setModifiedDate(LocalDateTime modifiedDate) {
        this.modifiedDate = modifiedDate == null ? null : modifiedDate.truncatedTo(ChronoUnit.NANOS);
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(String modifiedBy) {
        this.modifiedBy = modifiedBy;
    }

    public ZonedDateTime createdDateAsZonedDateTime() {
        return toZonedDateTime(this.createdDate);
    }

    public ZonedDateTime modifiedDateAsZonedDateTime() {
        return toZonedDateTime(this.modifiedDate);
    }

    public boolean isCurrent() {
        return this.current;
    }

    public void markAsCurrent() {
        this.current = true;
    }

    private static ZonedDateTime toZonedDateTime(LocalDateTime localDateTime) {
        return localDateTime
                .atZone(ZoneId.systemDefault())
                .toInstant()
                .atOffset(ZoneOffset.UTC)
                .toZonedDateTime()
                .truncatedTo(ChronoUnit.MILLIS);
    }
}