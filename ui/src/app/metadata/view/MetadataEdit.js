import React from 'react';
import { MetadataForm } from '../hoc/MetadataFormContext';
import { MetadataEditor } from '../editor/MetadataEditor';

export function MetadataEdit() {
    return (
        <MetadataForm>
            <MetadataEditor />
        </MetadataForm>
    );
}