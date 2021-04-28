import React from 'react';
import { useParams } from 'react-router';
import { useMetadataEntityXml } from '../hooks/api';

export const MetadataXmlContext = React.createContext();

export function MetadataXmlLoader({ children }) {

    let { type, id } = useParams();

    const { get, response } = useMetadataEntityXml(type);

    const [xml, setXml] = React.useState([]);

    async function loadMetadataXml(id) {
        const data = await get(`/${id}`)
        if (response.ok) {
            setXml(data);
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => { loadMetadataXml(id) }, [id]);

    return (
        <MetadataXmlContext.Provider value={xml}>
            {children}
        </MetadataXmlContext.Provider>
    );
}

export default MetadataXmlLoader;