import React from 'react';
import { MetadataFormContext, setFormDataAction, setFormErrorAction } from '../hoc/MetadataFormContext';
import { MetadataDefinitionContext, MetadataSchemaContext } from '../hoc/MetadataSchema';
import { transformErrors } from '../domain/transform';

import Form from '@rjsf/bootstrap-4';

import { fields, widgets } from '../../form/component';
import { templates } from '../../form/component';

function ErrorListTemplate() {
    return (<></>);
}

export function MetadataAttributeEditor({ children }) {

    const definition = React.useContext(MetadataDefinitionContext);
    const schema = React.useContext(MetadataSchemaContext);

    const { state, dispatch } = React.useContext(MetadataFormContext);
    const { metadata, errors } = state;

    const onChange = (changes) => {
        dispatch(setFormDataAction(changes.formData));
        dispatch(setFormErrorAction(changes.errors));
        // setBlocking(true);
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-end align-items-center">
                {children(metadata, errors)}
            </div>
            <hr />
            <div className="row">
                <div className="col-12 col-lg-12 order-2">
                    <Form formData={metadata}
                        noHtml5Validate={true}
                        onChange={(form) => onChange(form)}
                        schema={schema}
                        uiSchema={definition.uiSchema}
                        FieldTemplate={templates.FieldTemplate}
                        ObjectFieldTemplate={templates.ObjectFieldTemplate}
                        ArrayFieldTemplate={templates.ArrayFieldTemplate}
                        fields={fields}
                        widgets={widgets}
                        liveValidate={true}
                        ErrorList={ErrorListTemplate}
                        transformErrors={transformErrors}>
                        <></>
                    </Form>
                </div>
            </div>
            <pre>{JSON.stringify(errors, null, 4)}</pre>
        </div>
    );
}