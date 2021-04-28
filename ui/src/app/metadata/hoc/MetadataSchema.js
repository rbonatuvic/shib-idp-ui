import React from 'react';
import { useParams } from 'react-router';
import { useMetadataSchema } from '../hooks/api';
import { getDefinition } from '../domain/index';
import { MetadataObjectContext } from './MetadataSelector';

export const MetadataSchemaContext = React.createContext();
export const MetadataDefinitionContext = React.createContext();

export function MetadataSchema({ children }) {

    const metadata = React.useContext(MetadataObjectContext);

    const { type } = useParams();

    const definition = React.useMemo(() => getDefinition(
        type === 'source' ? type : metadata['@type']
    ), [type, metadata]);

    const { get, response } = useMetadataSchema();

    const [schema, setSchema] = React.useState();

    async function loadSchema(d) {
        const source = await get(`/${d.schema}`)
        if (response.ok) {
            setSchema(source);
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
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