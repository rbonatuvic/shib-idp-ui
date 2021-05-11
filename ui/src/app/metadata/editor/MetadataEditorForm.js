import React from 'react';

import Form from '@rjsf/bootstrap-4';
import FormCheck from 'react-bootstrap/FormCheck';

import { fields, widgets } from '../../form/component';
import { templates } from '../../form/component';
import { useUiSchema } from '../hooks/schema';
import Alert from 'react-bootstrap/esm/Alert';

const invisErrors = ['const', 'oneOf']

function ErrorListTemplate () {
    return (<></>);
}

export function MetadataEditorForm ({ metadata, definition, schema, current, onChange }) {

    const [locked, setLocked] = React.useState(true);

    const {uiSchema, step} = useUiSchema(definition, schema, current, locked);

    const [data, setData] = React.useState(metadata);

    React.useEffect(() => setData(metadata), [metadata, definition]);

    const onSubmit = () => {};

    const transformErrors = (errors) => {
        return errors.filter(e => invisErrors.indexOf(e.name) === -1);
    }
    return (
        <>
            {step.locked && <div className="">
                <div className="row">
                    <div className="col-9">
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
                    noHtml5Validate={true}
                    onChange={(form) => onChange(form)}
                    onSubmit={() => onSubmit()}
                    schema={schema}
                    uiSchema={uiSchema}
                    FieldTemplate={templates.FieldTemplate}
                    ObjectFieldTemplate={templates.ObjectFieldTemplate}
                    ArrayFieldTemplate={templates.ArrayFieldTemplate}
                    fields={fields}
                    widgets={widgets}
                    liveValidate={true}
                    transformErrors={transformErrors}
                    ErrorList={ErrorListTemplate}>
                    <></>
                </Form>
            </div>
            
        </>
    );
}