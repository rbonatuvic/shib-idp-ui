import React from 'react';
import { useParams } from 'react-router';
import { useMetadataEntity } from '../hooks/api';

export const MetadataTypeContext = React.createContext();
export const MetadataObjectContext = React.createContext();


export function MetadataSelector ({ children }) {

    let { type, id } = useParams();

    const { get, response } = useMetadataEntity(type);

    const [metadata, setMetadata] = React.useState([]);

    async function loadMetadata(id) {
        const source = await get(`/${id}`)
        if (response.ok) {
            setMetadata(source);
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => { loadMetadata(id) }, [id]);

    return (
        <>
        {type &&
            <MetadataTypeContext.Provider value={type}>
                {metadata && metadata.version &&
                <MetadataObjectContext.Provider value={metadata}>{children}</MetadataObjectContext.Provider>
                }
            </MetadataTypeContext.Provider>
        }
        </>
    );
}

export default MetadataSelector;