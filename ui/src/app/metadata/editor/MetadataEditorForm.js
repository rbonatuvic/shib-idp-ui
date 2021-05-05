import React from 'react';

import Form from '@rjsf/bootstrap-4';

import { fields } from '../../form/component';
import { CustomFieldTemplate } from '../../form/component/CustomFieldTemplate';
import { useUiSchema } from '../hooks/schema';

export function MetadataEditorForm ({ metadata, definition, schema, current }) {

    const uiSchema = useUiSchema(definition, schema, current);

    const [data, setData] = React.useState(metadata);

    React.useEffect(() => setData(metadata), [metadata]);

    return (
        <>
            <Form formData={data}
                onChange={ ({ formData }) => setData(formData) }
                schema={schema}
                uiSchema={uiSchema}
                FieldTemplate={CustomFieldTemplate}
                fields={ fields }></Form>
            <pre>{JSON.stringify(data, null, 4)}</pre>
        </>
    );
}