import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from '../../form/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faSave } from '@fortawesome/free-solid-svg-icons';
import Translate from '../../i18n/components/translate';
import set from 'lodash/set';

import { useGroupUiSchema, useGroupUiValidator, useGroupSchema, useGroupParser, useGroupFormatter} from '../hooks';
import { FormContext, setFormDataAction, setFormErrorAction } from '../../form/FormManager';

export function GroupForm ({group = {}, errors = [], context = {}, loading = false, schema, onSave, onCancel}) {

    const { dispatch } = React.useContext(FormContext);
    const onChange = ({formData, errors}) => {
        dispatch(setFormDataAction(formData));
        dispatch(setFormErrorAction(errors));
    };

    const uiSchema = useGroupUiSchema();
    const validator = useGroupUiValidator();
    const groupSchema = React.useMemo(() => {
        const filtered = context.groups.filter(g => !([group.resourceId].indexOf(g.resourceId) > -1));
        const enumList = filtered.map(g => g.resourceId);
        const enumNames = filtered.map(g => g.name);
        let s = { ...schema };
        s = set(s, 'properties.approversList.items.enum', enumList);
        s = set(s, 'properties.approversList.items.enumNames', enumNames);
        return s;
    }, [schema, context.groups, group.resourceId]);

    const parser = useGroupParser();
    const formatter = useGroupFormatter();

    return (<>
        <div className="container-fluid">
            <div className="d-flex justify-content-end align-items-center">
                <React.Fragment>
                    <Button variant="info" className="me-2"
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
                <div className="col-12 col-lg-6 order-2">
                    <Form formData={formatter(group)}
                        noHtml5Validate={true}
                        onChange={(form) => onChange({ ...form, formData: parser(form.formData) })}
                        validate={validator}
                        schema={groupSchema}
                        uiSchema={uiSchema}
                        liveValidate={true}>
                        <></>
                    </Form>
                </div>
            </div>
        </div>
    </>)
}
/**/