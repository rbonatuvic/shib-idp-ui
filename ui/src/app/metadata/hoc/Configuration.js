import React from 'react';
import { useMetadataConfiguration } from '../hooks/configuration';

export function Configuration ({entities, schema, definition, limited, children}) {
    const config = useMetadataConfiguration(entities, schema, definition, limited);
    return (
        <>{children(config)}</>
    );
}