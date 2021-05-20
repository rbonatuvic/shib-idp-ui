import React from 'react';
import { useLocation, useParams } from 'react-router';
import { useMetadataEntity } from '../hooks/api';

export const MetadataTypeContext = React.createContext();
export const MetadataObjectContext = React.createContext();
export const MetadataLoaderContext = React.createContext();

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
    React.useEffect(() => { loadMetadata(id) }, [id]);

    const update = () => loadMetadata(id);

    return (
        <>
        {type &&
            <MetadataTypeContext.Provider value={type}>
                {metadata && metadata.version &&
                <MetadataLoaderContext.Provider value={{ load: update }}>
                    <MetadataObjectContext.Provider value={metadata}>{children(metadata)}</MetadataObjectContext.Provider>
                </MetadataLoaderContext.Provider>
                }
            </MetadataTypeContext.Provider>
        }
        </>
    );
}

export function useMetadataObject () {
    return React.useContext(MetadataObjectContext);
}

export function useMetadataLoader () {
    return React.useContext(MetadataLoaderContext);
}

export default MetadataSelector;