import React from 'react';
import { getDefinition, getWizard } from '../domain/index';
import useFetch from 'use-http';
import { useTranslator } from '../../i18n/hooks';

export const MetadataSchemaContext = React.createContext();
export const MetadataDefinitionContext = React.createContext();
export const MetadataSchemaLoading = React.createContext();
export const MetadataSchemaLoader = React.createContext();
export const MetadataSchemaType = React.createContext();

export function MetadataSchema({ type, children, wizard = false }) {

    const [kind, setKind] = React.useState(type);

    const [loading, setLoading] = React.useState(false);

    const [definition, setDefinition] = React.useState(wizard ? getWizard(kind) : getDefinition(kind));

    const { get, response } = useFetch(``, {
        cachePolicy: 'no-cache'
    });

    const [schema, setSchema] = React.useState();

    async function loadSchema(type) {
        const definition = wizard ? getWizard(type) : getDefinition(type);
        setDefinition(definition);
        setKind(type);
        setLoading(true);

        const source = await get(`/${definition.schema}`)
        if (response.ok) {
            setSchema(source);
        }
        setLoading(false);
    }

    React.useState(() => {
        loadSchema(type);
    }, [type]);

    return (
        <MetadataDefinitionContext.Provider value={definition}>
            {type && definition && schema &&
                <MetadataSchemaContext.Provider value={ schema }>
                    <MetadataSchemaLoading.Provider value={ loading }>
                        <MetadataSchemaLoader.Provider value={ loadSchema }>
                            <MetadataSchemaType.Provider value={ kind }>
                                {children}
                            </MetadataSchemaType.Provider>
                        </MetadataSchemaLoader.Provider>
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

export function useMetadataSchemaLoader () {
    return React.useContext(MetadataSchemaLoader);
}

export function useMetadataDefinitionContext() {
    return React.useContext(MetadataDefinitionContext);
}

export function useMetadataSchemaType() {
    return React.useContext(MetadataSchemaType);
}

export function useMetadataDefinitionValidator(data, current, group) {
    const definition = useMetadataDefinitionContext();
    const translator = useTranslator();
    return definition.validator(data, current, group, translator);
}

export default MetadataSchema;