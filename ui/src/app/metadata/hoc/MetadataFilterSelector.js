import React from 'react';
import { useLocation, useParams } from 'react-router';
import { useMetadataFilters } from '../hooks/api';

export const MetadataFilterContext = React.createContext();

/*eslint-disable react-hooks/exhaustive-deps*/
export function MetadataFilterSelector({ children }) {

    let { id, filterId } = useParams();
    const location = useLocation();

    React.useEffect(() => {
        if (location.state?.refresh) {
            loadFilter(id);
        }
    }, [location, id])

    const { get, response } = useMetadataFilters(id, {
        cachePolicy: 'no-cache'
    });

    const [filter, setFilter] = React.useState([]);

    async function loadFilter(filterId) {
        const f = await get(`/${filterId}`);
        if (response.ok) {
            setFilter(f);
        }
    }
    React.useEffect(() => { loadFilter(filterId) }, [id]);

    return (
        <MetadataFilterContext.Provider value={filter}>
            {filter && filter.version &&
                <React.Fragment>{children}</React.Fragment>
            }
        </MetadataFilterContext.Provider>
    );
}

export function useMetadataFilterObject () {
    return React.useContext(MetadataFilterContext);
}

export default MetadataFilterSelector;