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

    const [context, setContext] = React.useState(definition.steps.find(s => s.id === current));

    React.useEffect(() => {
        setContext(definition.steps.find(s => s.id === current))
    }, [current, definition]);

    return (
        <>
            <Form formData={data}
                noHtml5Validate={true}
                onChange={({ formData }) => setData(formData) }
                onSubmit={() => onSubmit()}
                schema={schema}
                uiSchema={uiSchema}
                FieldTemplate={templates.FieldTemplate}
                ObjectFieldTemplate={templates.ObjectFieldTemplate}
                ArrayFieldTemplate={templates.ArrayFieldTemplate}
                fields={ fields }
                widgets={widgets}
                liveValidate={true}
                formContext={context}>
                    <></>
                </Form>
            <div className="row">
                <div className="col-6">
                    <pre>{JSON.stringify(data, null, 4)}</pre>
                </div>
                <div className="col-6">
                    <pre>{JSON.stringify(schema, null, 4)}</pre>
                </div>
            </div>
        </>
    );
}