package edu.internet2.tier.shibboleth.admin.ui.service;

/**
 * Generic API to resolve values from arbitrary tokenized placeholders such as '%{token.placeholder}' etc.
 *
 * @author Dmitriy Kopylenko
 */
public interface TokenPlaceholderValueResolvingService {

    String resolveValueFromTokenPlaceholder(String tokenPlaceholder);
}
