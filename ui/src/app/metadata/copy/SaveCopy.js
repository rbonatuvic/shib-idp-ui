import React from 'react';
import { MetadataDefinitionContext, MetadataSchemaContext } from '../hoc/MetadataSchema';
import { useMetadataConfiguration } from '../hooks/configuration';
import { removeNull } from '../../core/utility/remove_null';

import { MetadataConfiguration } from '../component/MetadataConfiguration';

export function useCopiedConfiguration(copy, schema, definition) {
    const { properties, target, serviceProviderName, entityId } = copy;
    const copied = removeNull(properties.reduce((c, section) => ({ ...c, ...{ [section]: target[section] } }), {}));
    const model = [{
        serviceProviderName,
        entityId,
        ...copied
    }];
    return useMetadataConfiguration(model, schema, definition);
}

export function SaveCopy ({ copy }) {
    const definition = React.useContext(MetadataDefinitionContext);
    const schema = React.useContext(MetadataSchemaContext);

    const configuration = useCopiedConfiguration(copy, schema, definition);

    return (<MetadataConfiguration configuration={configuration} />);
}