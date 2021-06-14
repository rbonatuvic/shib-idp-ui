import React from 'react';
import { useMetadataFilters } from '../../../hooks/api';
import { DeleteConfirmation } from '../../../component/DeleteConfirmation';

export const MetadataFiltersContext = React.createContext();

export function MetadataFilters ({ providerId, types = [], filters, children }) {

    const { put, del, get, response, loading } = useMetadataFilters(providerId, {
        cachePolicy: 'no-cache'
    });

    const [filterData, setFilterData] = React.useState([]);

    async function loadFilters(id) {
        const list = await get(``);
        if (response.ok) {
            setFilterData(list.filter(f => types.length > 1 ? types.indexOf(f['@type']) > -1 : true));
        }
    }

    async function updateFilter(filter) {
        await put(`/${filter.resourceId}`, filter);
        if (response.ok) {
            loadFilters(providerId);
        }
    }

    async function deleteFilter(filterId) {
        await del(`/${filterId}`);
        if (response.ok) {
            loadFilters();
        }
    }

    const onDelete = (id) => deleteFilter(id);
    const onUpdate = (f) => updateFilter(f);

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => {
        if (!filters) {
            loadFilters(providerId);
        } else {
            setFilterData(filterData);
        }
    }, [providerId]);


    return (
        <DeleteConfirmation title={`message.delete-filter-title`} body={`message.delete-filter-body`}>
            {(block) =>
                <MetadataFiltersContext.Provider value={filterData}>
                    {children(filterData, onUpdate, (id) => block(() => onDelete(id)), loading)}
                </MetadataFiltersContext.Provider>
            }
        </DeleteConfirmation>
    );
}