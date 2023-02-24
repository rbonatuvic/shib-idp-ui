package edu.internet2.tier.shibboleth.admin.ui.domain.util;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.Date;

/**
 * Generally speaking, this isn't used, but is here to ensure that the table gets created cleanly regardless of DB type
 */
@Entity
public class Shedlock {
    @Id
    String name;

    Date lockUntil;

    Date lockedAt;

    String locked_by;
}