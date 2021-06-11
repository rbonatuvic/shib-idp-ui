import React from 'react';

import Form from '@rjsf/bootstrap-4';

import { fields, widgets } from '../../form/component';
import { templates } from '../../form/component';
import { useUiSchema } from '../hooks/schema';

const invisErrors = ['const', 'oneOf']

function ErrorListTemplate () {
    return (<></>);
}

export function MetadataWizardForm ({ metadata, definition, schema, current, onChange, onBlur = false, validator }) {

    const {uiSchema} = useUiSchema(definition, schema, current);

    const [data, setData] = React.useState(metadata);

    React.useEffect(() => setData(metadata), [metadata, definition]);

    const onSubmit = () => {};

    const transformErrors = (errors) => {
        let list = [
            ...errors.filter(e => invisErrors.indexOf(e.name) === -1)
        ].map(e => {
            if (e.name === 'pattern' && e.property.includes('email')) {
                e.message = 'message.valid-email';
            }
            return e;
        });

        return list;
    }

    const onFormChange = (form) => {
        onChange(definition.bindings ? { ...form, formData: definition.bindings(data, form.formData) } : form);
    };

    return (
        <>
            <div className="container-fluid">
                <Form formData={data}
                    noHtml5Validate={true}
                    onChange={(form) => onFormChange(form)}
                    onSubmit={() => onSubmit()}
                    onBlur={() => onBlur(data)}
                    schema={schema}
                    uiSchema={uiSchema}
                    FieldTemplate={templates.FieldTemplate}
                    ObjectFieldTemplate={templates.ObjectFieldTemplate}
                    ArrayFieldTemplate={templates.ArrayFieldTemplate}
                    fields={fields}
                    widgets={widgets}
                    liveValidate={true}
                    transformErrors={transformErrors}
                    ErrorList={ErrorListTemplate}
                    validate={validator}>
                    <></>
                </Form>
            </div>
        </>
    );
}