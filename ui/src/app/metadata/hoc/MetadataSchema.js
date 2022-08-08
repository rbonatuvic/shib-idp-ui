import React from 'react';
import { getDefinition, getWizard } from '../domain/index';
import useFetch from 'use-http';
import { useTranslator } from '../../i18n/hooks';

export const MetadataSchemaContext = React.createContext();
export const MetadataDefinitionContext = React.createContext();
export const MetadataSchemaLoading = React.createContext();

export function MetadataSchema({ type, children, wizard = false }) {

    const definition = React.useMemo(() => wizard ? getWizard(type) : getDefinition(type), [type, wizard]);
    const [loading, setLoading] = React.useState(false);

    const { get, response } = useFetch(``, {
        cachePolicy: 'no-cache'
    });

    const [schema, setSchema] = React.useState();

    async function loadSchema(d) {
        const source = await get(`/${d.schema}`)
        if (response.ok) {
            setSchema(source);
        }
        setLoading(false);
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => {
        setSchema(null);
        loadSchema(definition);
        setLoading(true);
    }, [definition]);

    return (
        <MetadataDefinitionContext.Provider value={definition}>
            {type && definition && schema &&
                <MetadataSchemaContext.Provider value={ schema }>
                    <MetadataSchemaLoading.Provider value={ loading }>
                        {children}
                    </MetadataSchemaLoading.Provider>
                </MetadataSchemaContext.Provider>
            }
        </MetadataDefinitionContext.Provider>
    );
}

export function useMetadataSchemaContext () {
    return React.useContext(MetadataSchemaContext);
}

export function useMetadataSchemaLoading () {
    return React.useContext(MetadataSchemaLoading);
}

export function useMetadataDefinitionContext() {
    return React.useContext(MetadataDefinitionContext);
}

export function useMetadataDefinitionValidator(data, current, group) {
    const definition = useMetadataDefinitionContext();
    const translator = useTranslator();
    return definition.validator(data, current, group, translator);
}

export default MetadataSchema;