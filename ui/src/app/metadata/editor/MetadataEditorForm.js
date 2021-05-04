import React from 'react';

import Form from '@rjsf/bootstrap-4';

export function MetadataEditorForm ({ metadata, definition, schema }) {



    return (
        <>
            <Form model={metadata} schema={schema}></Form>
        </>
    );
}