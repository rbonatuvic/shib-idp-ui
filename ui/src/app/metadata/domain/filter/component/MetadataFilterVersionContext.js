import React from 'react';
import { MetadataFilterTypes } from '../index';

export const isAdditionalFilter = (type) => MetadataFilterTypes.indexOf(type) > -1;

export const getVersionModelFilterPluginsFn = (model, kind) => {
    const filters = kind === 'provider' ?
        model.metadataFilters ? model.metadataFilters.filter(filter => MetadataFilterTypes.indexOf(filter['@type']) === -1) :
            [] : null;
    return filters;
};

export const getComparisonModelsFilteredFn = (models) => models.map((model) => {
    return ({
        ...model,
        metadataFilters: getVersionModelFilterPluginsFn(
            model,
            model.hasOwnProperty('@type') ? model.hasOwnProperty('metadataFilters') ? 'provider' : 'filter' : 'resolver'
        )
    });
});

export const getVersionModelFiltersFn =
    (model, kind) => kind === 'provider' ?
        model.metadataFilters ? model.metadataFilters.filter(filter => isAdditionalFilter(filter['@type'])) :
            [] : null;

export const getComparisonFilterOrderedFn = (list) =>
    list.map(models =>
        models.map(filter =>
        ({
            ...filter,
            comparable: list
                .reduce((acc, v) => acc.concat(v), [])
                .map(v => v.resourceId)
                .some((id, index, coll) => {
                    return coll.indexOf(filter.resourceId) !== coll.lastIndexOf(filter.resourceId);
                })
        })
        ));

export const getComparisonFilterListFn = (models) => models.map(m => getVersionModelFiltersFn(m, 'provider'));

export const getComparisonFilterConfiguration = (filters, dates) => {
    const rows = filters.reduce((num, version) => version.length > num ? version.length : num, 0);
    const range = [...Array(rows).keys()];
    return {
        dates,
        filters: range.reduce((collection, index) => {
            const val = filters.map(version => version[index]);
            collection[index] = val;
            return collection;
        }, [])
    };
}

export function useComparisonFilterList(models) {
    return React.useMemo(() => getComparisonFilterListFn(models), [models]);
}

export function useOrderedComparisonFilterList (models) {
    const data = useComparisonFilterList(models);

    return React.useMemo(() => getComparisonFilterOrderedFn(data), [data]);
}

export function useComparisonFilterConfiguration (models, dates) {
    const filters = useOrderedComparisonFilterList(models);
    
    return React.useMemo(() => getComparisonFilterConfiguration(filters, dates), [filters, dates]);
}


export function MetadataFilterVersionContext ({ models, dates, children }) {
    const config = useComparisonFilterConfiguration(models, dates);

    return (<>{children(config)}</>);
}