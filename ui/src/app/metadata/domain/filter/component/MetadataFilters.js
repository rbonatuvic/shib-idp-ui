import React from 'react';
import { useMetadataEntities } from '../../../hooks/api';

export const MetadataFiltersContext = React.createContext();

export function MetadataFilters ({ providerId, types = [], children }) {

    const { get, response } = useMetadataEntities('provider');

    const [filters, setFilters] = React.useState([]);

    async function loadFilters(id) {
        const list = await get(`/${id}/Filters`);
        if (response.ok) {
            setFilters(list.filter(f => types.length > 1 ? types.indexOf(f['@type']) > -1 : true));
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => { loadFilters(providerId) }, [providerId]);


    return (
        <MetadataFiltersContext.Provider value={filters}>{children}</MetadataFiltersContext.Provider>
    );
}