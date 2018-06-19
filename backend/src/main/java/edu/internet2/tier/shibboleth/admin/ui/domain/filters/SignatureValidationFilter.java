package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OrderColumn;
import java.util.ArrayList;
import java.util.List;

@Entity
@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
@ToString
public class SignatureValidationFilter extends MetadataFilter {

    public SignatureValidationFilter() {
        type = "SignatureValidation";
    }

    private Boolean requireSignedRoot = true;

    private String certificateFile;

    private String defaultCriteriaRef;

    private String signaturePrevalidatorRef;

    private String dynamicTrustedNamesStrategyRef;

    private String trustEngineRef;

    private String publicKey;
}
