package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

/**
 * Concrete implementations of the MetadataFilter should implement the updateConcreteFilterTypeData signature to 
 * populate specific type data from the existing filter to the target filter.
 */
public interface IConcreteMetadataFilterType<T> {
    
    /**
     * @param filterToBeUpdated the target of the data
     * @return the filterToBeUpdated with the updated information from the existing filter
     */
    T updateConcreteFilterTypeData(T filterToBeUpdated);
}
