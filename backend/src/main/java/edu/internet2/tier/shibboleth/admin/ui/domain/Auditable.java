package edu.internet2.tier.shibboleth.admin.ui.domain;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDateTime;


public interface Auditable extends Serializable {

    Long getAudId();

    void setAudId(@NotNull final Long id);

    LocalDateTime getCreatedDate();

    void setCreatedDate(@NotNull final LocalDateTime createdDate);

    LocalDateTime getModifiedDate();

    void setModifiedDate(final LocalDateTime modifiedDate);
}
