import React from 'react';

import Form from '../../form/Form';
import FormCheck from 'react-bootstrap/FormCheck';

import { useUiSchema } from '../hooks/schema';
import Alert from 'react-bootstrap/Alert';

import { transformErrors } from '../domain/transform';
import { useUserGroup } from '../../core/user/UserContext';


export function MetadataEditorForm({ metadata, definition, schema, current, onChange, validator }) {

    const [locked, setLocked] = React.useState(true);

    const {uiSchema, step} = useUiSchema(definition, schema, current, locked);

    const [data, setData] = React.useState(metadata);

    React.useEffect(() => setData(metadata), [metadata, definition]);

    const onSubmit = () => {};

    const onFormChange = (form) => {
        onChange(definition.bindings ? { ...form, formData: definition.bindings(data, form.formData) }: form);
    };

    const group = useUserGroup();

    const context = {
        group
    };

    return (
        <>
            {step.locked && <div className="">
                <div className="row no-gutters">
                    <div className="col-lg-8">
                        <Alert variant="danger" className="d-flex justify-content-between align-items-center font-weight-bold mb-3">
                            <FormCheck
                                type="switch"
                                id="custom-switch"
                                label={locked ? 'Locked' : 'Unlocked'}
                                onChange={() => setLocked(!locked)}
                                size="lg"
                            />
                            <span className="p-1">For Advanced Knowledge Only</span>
                        </Alert>
                    </div>
                </div>
            </div>}
            <div className="container-fluid">
                <Form formData={data}
                    noHtml5Validate={false}
                    onChange={(form) => onFormChange(form)}
                    onSubmit={() => onSubmit()}
                    schema={schema}
                    uiSchema={uiSchema}
                    liveValidate={true}
                    transformErrors={transformErrors}
                    validate={validator}
                    formContext={context}>
                    <></>
                </Form>
                
            </div>
        </>
    );
}