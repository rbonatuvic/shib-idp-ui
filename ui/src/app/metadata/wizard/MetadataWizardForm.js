import React from 'react';
import Form from '../../form/Form';
import { useUiSchema } from '../hooks/schema';
import { transformErrors } from '../domain/transform';

export function MetadataWizardForm ({ metadata, definition, schema, current, onChange, onBlur = () => {}, validator }) {

    const {uiSchema} = useUiSchema(definition, schema, current);

    const [data, setData] = React.useState(metadata);

    React.useEffect(() => setData(metadata), [metadata, definition]);

    const onSubmit = () => {};

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
                    liveValidate={true}
                    transformErrors={transformErrors}
                    validate={validator}>
                    <></>
                </Form>
            </div>
        </>
    );
}