import React from 'react';
import { useParams } from 'react-router-dom';
import { useMetadataEntity } from '../hooks/api';

export const MetadataVersionContext = React.createContext();

const { Provider } = MetadataVersionContext;

export function MetadataVersionLoader({children}) {

    const { type, id, versionId } = useParams();

    const [metadata, setMetadata] = React.useState();

    const { get, response } = useMetadataEntity(type, {
        cachePolicy: 'no-cache',
    }, []);

    async function loadVersion(v) {
        const l = await get(`/${id}/Versions/${v}`);
        if (response.ok) {
            setMetadata(l);
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => {
        loadVersion(versionId);
    }, [versionId]);

    return (
        <>
            {metadata &&
                <Provider value={metadata}>{children(metadata)}</Provider>
            }
        </>
    );
}
