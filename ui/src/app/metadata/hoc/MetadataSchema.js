import React from 'react';
import { getDefinition, getWizard } from '../domain/index';
import useFetch from 'use-http';

export const MetadataSchemaContext = React.createContext();
export const MetadataDefinitionContext = React.createContext();

export function MetadataSchema({ type, children, wizard = false }) {

    const definition = React.useMemo(() => wizard ? getWizard(type) : getDefinition(type), [type, wizard]);

    const { get, response } = useFetch(``, {}, []);

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

export function useMetadataSchemaContext () {
    return React.useContext(MetadataSchemaContext);
}

export function useMetadataDefinitionContext() {
    return React.useContext(MetadataDefinitionContext);
}

//getConfigurationSections

export default MetadataSchema;