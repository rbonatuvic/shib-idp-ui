import React from 'react';

import Form from '@rjsf/bootstrap-4';

import { fields, widgets } from '../../form/component';
import { templates } from '../../form/component';
import { useUiSchema } from '../hooks/schema';

export function MetadataEditorForm ({ metadata, definition, schema, current, onChange }) {

    const uiSchema = useUiSchema(definition, schema, current);

    const [data, setData] = React.useState(metadata);

    React.useEffect(() => setData(metadata), [metadata, definition]);

    const onSubmit = () => {};


    return (
        <>
            <Form formData={data}
                noHtml5Validate={true}
                onChange={(form) => onChange(form) }
                onSubmit={() => onSubmit()}
                schema={schema}
                uiSchema={uiSchema}
                FieldTemplate={templates.FieldTemplate}
                ObjectFieldTemplate={templates.ObjectFieldTemplate}
                ArrayFieldTemplate={templates.ArrayFieldTemplate}
                fields={ fields }
                widgets={widgets}
                liveValidate={true}>
                    <></>
                </Form>
        </>
    );
}