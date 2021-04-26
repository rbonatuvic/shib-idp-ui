import React from 'react';
import { useParams } from 'react-router';
import { useMetadataSchema, getSchemaPath } from '../hooks/api';

export const MetadataSchemaContext = React.createContext();


export function MetadataSchema({ children }) {

    let { type } = useParams();

    const { get, response } = useMetadataSchema();

    const [schema, setSchema] = React.useState([]);

    async function loadSchema(t) {
        const source = await get(`/${getSchemaPath(t)}`)
        if (response.ok) {
            setSchema(source);
        }
    }

    React.useEffect(() => { loadSchema(type) }, [type]);

    return (
        <>
            {type &&
                <MetadataSchemaContext.Provider value={type}>
                    {children}
                </MetadataSchemaContext.Provider>
            }
        </>
    );
}

export default MetadataSchema;