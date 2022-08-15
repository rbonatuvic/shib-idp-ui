import React from 'react';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faSave } from '@fortawesome/free-solid-svg-icons';
import Translate from '../../i18n/components/translate';

import { FormContext, setFormDataAction, setFormErrorAction } from '../../form/FormManager';

export function ConfigurationForm({ property = {}, errors = [], loading = false, schema, onSave, onCancel }) {

    const { dispatch } = React.useContext(FormContext);
    const onChange = ({ formData, errors }) => {
        dispatch(setFormDataAction(formData));
        dispatch(setFormErrorAction(errors));
    };

    return (<>
        <div className="container-fluid">
            <div className="d-flex justify-content-end align-items-center">
                <React.Fragment>
                    <Button variant="info" className="me-2"
                        type="button"
                        onClick={() => onSave(property)}
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
                <div className="col-12 col-lg-6 order-2">
                    
                </div>
            </div>
        </div>
    </>)
}
/**/