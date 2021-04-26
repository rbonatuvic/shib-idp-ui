import React from 'react';
import { useParams } from 'react-router';
import { useMetadataSchema } from '../hooks/api';
import { getDefinition } from '../domain/index';

export const MetadataSchemaContext = React.createContext();
export const MetadataDefinitionContext = React.createContext();

export function MetadataSchema({ children }) {

    let { type } = useParams();

    const definition = React.useMemo(() => getDefinition(type), [type]);

    const { get, response } = useMetadataSchema();

    const [schema, setSchema] = React.useState();

    async function loadSchema(d) {
        const source = await get(`/${definition.schema}`)
        if (response.ok) {
            setSchema(source);
        }
    }

    React.useEffect(() => { loadSchema(definition) }, [definition]);

    return (
        <MetadataDefinitionContext.Provider value={definition}>
            {type && definition && schema &&
                <MetadataSchemaContext.Provider value={schema}>
                    {children}
                </MetadataSchemaContext.Provider>
            }
        </MetadataDefinitionContext.Provider>
    );
}

//getConfigurationSections

export default MetadataSchema;