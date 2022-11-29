import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from '../../form/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faSave } from '@fortawesome/free-solid-svg-icons';
import Translate from '../../i18n/components/translate';

import { FormContext, setFormDataAction, setFormErrorAction } from '../../form/FormManager';
import { useDynamicRegistrationUiSchema, useDynamicRegistrationValidator } from '../api';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useGetDynamicRegistrationsQuery } from '../../store/dynamic-registration/DynamicRegistrationSlice';


export function DynamicRegistrationForm ({registration = {}, errors = [], loading = false, schema, onSave, onCancel}) {

    const {data: registrations = []} = useGetDynamicRegistrationsQuery();

    const [touched, setTouched] = React.useState(false);

    const { dispatch } = React.useContext(FormContext);
    const onChange = ({formData, errors, ...props}) => {
        dispatch(setFormDataAction(formData));
        dispatch(setFormErrorAction(errors));
        setTouched(true);
    };

    const uiSchema = useDynamicRegistrationUiSchema();
    const validator = useDynamicRegistrationValidator(registrations);

    return (<>
        <div className="container-fluid">
            <div className="d-flex justify-content-end align-items-center">
                <React.Fragment>
                    <Button variant="info" className="me-2"
                        type="button"
                        onClick={() => onSave(registration)}
                        disabled={!touched || errors.length > 0 || loading}
                        aria-label="Save changes to the dynamic registration. You will return to the dashboard">
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
            <Row>
                <Col>
                    <Form formData={registration}
                        noHtml5Validate={true}
                        onChange={(form) => onChange(form)}
                        onError={(errors) => console.log(errors)}
                        validate={validator}
                        schema={schema}
                        uiSchema={uiSchema}
                        liveValidate={true}>
                        <></>
                    </Form>
                </Col>
            </Row>
        </div>
    </>)
}
/**/