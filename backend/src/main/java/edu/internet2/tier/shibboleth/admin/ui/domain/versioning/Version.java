package edu.internet2.tier.shibboleth.admin.ui.domain.versioning;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Represents version information of any versioned entity in the system.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class Version implements Serializable {

    private String id;

    private String creator;

    private LocalDateTime date;

    private static final long serialVersionUID = 3429591830989243421L;

}
