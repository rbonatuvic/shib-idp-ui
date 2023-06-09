import React from 'react';
import { MetadataForm } from '../hoc/MetadataFormContext';
import { MetadataEditor } from '../editor/MetadataEditor';
import { useMetadataObject } from '../hoc/MetadataSelector';

export function MetadataEdit({reload}) {

    const base = useMetadataObject();

    return (
        <MetadataForm initial={base}>
            <MetadataEditor current={base} reload={reload} />
        </MetadataForm>
    );
}