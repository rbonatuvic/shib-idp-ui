import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from '@rjsf/bootstrap-4';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faSave } from '@fortawesome/free-solid-svg-icons';
import Translate from '../../i18n/components/translate';

import { useGroupUiSchema } from '../hooks';
import { fields, widgets } from '../../form/component';
import { templates } from '../../form/component';
import { FormContext, setFormDataAction } from '../../form/FormManager';

function ErrorListTemplate() {
    return (<></>);
}

export function GroupForm ({group = {}, errors = [], loading = false, schema, onSave, onCancel}) {

    const { dispatch } = React.useContext(FormContext);
    const onChange = ({formData}) => {
        dispatch(setFormDataAction(formData));
    };

    const uiSchema = useGroupUiSchema();

    return (<>
        <div className="container-fluid">
            <div className="d-flex justify-content-end align-items-center">
                <React.Fragment>
                    <Button variant="info" className="mr-2"
                        type="button"
                        onClick={() => onSave(group)}
                        disabled={errors.length > 0 || loading}
                        aria-label="Save changes to the metadata source. You will return to the dashboard">
                        <FontAwesomeIcon icon={loading ? faSpinner : faSave} pulse={loading} />&nbsp;
                        <Translate value="action.save">Save</Translate>
                    </Button>
                    <Button variant="secondary"
                        type="button"
                        onClick={() => onCancel()} aria-label="Cancel changes, go back to dashboard">
                        <Translate value="action.cancel">Cancel</Translate>
                    </Button>
                </React.Fragment>
            </div>
            <hr />
            <div className="row">
                <div className="col-12 col-lg-12 order-2">
                    <Form formData={group}
                        noHtml5Validate={true}
                        onChange={(form) => onChange(form)}
                        schema={schema}
                        uiSchema={uiSchema}
                        FieldTemplate={templates.FieldTemplate}
                        ObjectFieldTemplate={templates.ObjectFieldTemplate}
                        ArrayFieldTemplate={templates.ArrayFieldTemplate}
                        fields={fields}
                        widgets={widgets}
                        liveValidate={true}
                        ErrorList={ErrorListTemplate}>
                        <></>
                    </Form>
                </div>
            </div>
        </div>
    </>)
}
/**/