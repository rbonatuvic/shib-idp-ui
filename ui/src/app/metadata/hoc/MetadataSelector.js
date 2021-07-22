import React from 'react';
import { useLocation, useParams } from 'react-router';
import { useMetadataEntity } from '../hooks/api';

export const MetadataTypeContext = React.createContext();
export const MetadataObjectContext = React.createContext();

/*eslint-disable react-hooks/exhaustive-deps*/
export function MetadataSelector({ children, ...props }) {

    let { type, id } = useParams();
    const location = useLocation();

    if (!type) {
        type = props.type;
    }

    React.useEffect(() => {
        if (location.state?.refresh) {
            loadMetadata(id);
        }
    }, [location, id])

    const { get, response } = useMetadataEntity(type);

    const [metadata, setMetadata] = React.useState([]);

    async function loadMetadata(id) {
        const source = await get(`/${id}`);
        if (response.ok) {
            setMetadata(source);
        }
    }

    const reload = () => loadMetadata(id);

    React.useEffect(() => { loadMetadata(id) }, [id]);

    return (
        <>
        {type &&
            <MetadataTypeContext.Provider value={type}>
                {metadata && metadata.version &&
                    <MetadataObjectContext.Provider value={metadata}>{children(metadata, reload)}</MetadataObjectContext.Provider>
                }
            </MetadataTypeContext.Provider>
        }
        </>
    );
}

export function useMetadataObject () {
    return React.useContext(MetadataObjectContext);
}

export default MetadataSelector;