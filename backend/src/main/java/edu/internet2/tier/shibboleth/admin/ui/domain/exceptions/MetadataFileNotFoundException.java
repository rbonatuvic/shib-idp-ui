package edu.internet2.tier.shibboleth.admin.ui.domain.exceptions;

/**
 * Indicates that provided metadata file is not found. Thrown during opensaml API initialization code path, if there is
 * such. Throwing such exception is useful in @Transactional context for atomic transaction rollbacks, etc.
 *
 * @author Dmitriy Kopylenko
 */
public class MetadataFileNotFoundException extends RuntimeException {

    public MetadataFileNotFoundException(String message) {
        super(message);
    }
}
