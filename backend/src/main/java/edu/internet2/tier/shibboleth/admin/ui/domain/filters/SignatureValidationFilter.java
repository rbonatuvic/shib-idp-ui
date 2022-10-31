package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.envers.Audited;

import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
@ToString
@Audited
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

    public boolean xmlShouldBeGenerated() {
        return requireSignedRoot;
    }
    
    private SignatureValidationFilter updateConcreteFilterTypeData(SignatureValidationFilter filterToBeUpdated) {
        filterToBeUpdated.setRequireSignedRoot(getRequireSignedRoot());
        filterToBeUpdated.setCertificateFile(getCertificateFile());
        filterToBeUpdated.setDefaultCriteriaRef(getDefaultCriteriaRef());
        filterToBeUpdated.setSignaturePrevalidatorRef(getSignaturePrevalidatorRef());
        filterToBeUpdated.setDynamicTrustedNamesStrategyRef(getDynamicTrustedNamesStrategyRef());
        filterToBeUpdated.setTrustEngineRef(getTrustEngineRef());
        filterToBeUpdated.setPublicKey(getPublicKey());
        return filterToBeUpdated;
    }

    @Override
    public MetadataFilter updateConcreteFilterTypeData(MetadataFilter filterToBeUpdated) {
        return updateConcreteFilterTypeData((SignatureValidationFilter) filterToBeUpdated);
    }
}