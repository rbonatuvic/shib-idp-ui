import React from 'react';
import { useMetadataEntities } from '../../../hooks/api';

export const MetadataFiltersContext = React.createContext();

export function MetadataFilters ({ providerId, types = [], filters, children }) {

    const { get, response } = useMetadataEntities('provider');

    const [filterData, setFilterData] = React.useState([]);

    async function loadFilters(id) {
        const list = await get(`/${id}/Filters`);
        if (response.ok) {
            setFilterData(list.filter(f => types.length > 1 ? types.indexOf(f['@type']) > -1 : true));
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => {
        if (!filterData) {
            loadFilters(providerId);
        } else {
            setFilterData(filterData);
        }
    }, [providerId]);


    return (
        <MetadataFiltersContext.Provider value={filterData}>{children}</MetadataFiltersContext.Provider>
    );
}