import React from 'react';
import { MetadataFormContext, setFormDataAction, setFormErrorAction } from '../hoc/MetadataFormContext';
import { MetadataDefinitionContext, MetadataSchemaContext } from '../hoc/MetadataSchema';
import { transformErrors } from '../domain/transform';

import Form from '../../form/Form';

export function AttributeBundleEditor({ children }) {

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
                        liveValidate={true}
                        transformErrors={transformErrors}>
                        <></>
                    </Form>
                </div>
            </div>
        </div>
    );
}