import React from 'react';
import { faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from 'react-bootstrap/Button';
import { Prompt, useHistory, useParams } from 'react-router-dom';
import Translate from '../../i18n/components/translate';
import { MetadataAttributeEditor } from '../editor/MetadataAttributeEditor';
import { useMetadataAttribute } from '../hooks/api';

import { CustomAttributeDefinition, CustomAttributeEditor } from '../domain/attribute/CustomAttributeDefinition';
import MetadataSchema from '../hoc/MetadataSchema';
import { MetadataForm } from '../hoc/MetadataFormContext';
import { createNotificationAction, NotificationTypes } from '../../store/notifications/NotificationSlice';
import { useDispatch } from 'react-redux';

export function MetadataAttributeEdit() {
    const { id } = useParams();
    const history = useHistory();

    const definition = CustomAttributeDefinition;

    const dispatch = useDispatch();

    const { get, put, response, loading } = useMetadataAttribute({
        cachePolicy: 'no-cache'
    });

    const [blocking, setBlocking] = React.useState(false);

    async function loadAttribute() {
        const attr = await get(`/${id}`);
        if (response.ok) {
            setAttribute(attr);
        }
    }

    async function save(metadata) {
        let toast;
        const resp = await put(``, definition.parser(metadata));
        if (response.ok) {
            toast =  createNotificationAction(`Updated attribute successfully.`, NotificationTypes.SUCCESS);
            gotoDetail({ refresh: true });
        } else {
            toast = createNotificationAction(`${resp.errorCode}: Unable to edit attribute ... ${resp.errorMessage}`, 'danger', 5000);
        }
        if (toast) {
            dispatch(toast);
        }
    };

    const cancel = () => {
        gotoDetail();
    };

    const gotoDetail = (state = null) => {
        setBlocking(false);
        history.push(`/metadata/attributes`, state);
    };

    const [attribute, setAttribute] = React.useState();

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => {
        loadAttribute();
    }, []);

    return (
        <div className="container-fluid p-3">
            <Prompt
                when={blocking}
                message={location =>
                    `message.unsaved-editor`
                }
            />
            <section className="section" tabIndex="0">
                <div className="section-header bg-info p-2 text-white">
                    <div className="row justify-content-between">
                        <div className="col-md-12">
                            <span className="lead"><Translate value="label.new-attribute">Add a new metadata attribute</Translate></span>
                        </div>
                    </div>
                </div>
                <div className="section-body p-4 border border-top-0 border-info">
                    <MetadataSchema type={CustomAttributeEditor}>
                        {attribute &&
                        <MetadataForm initial={attribute}>
                            <MetadataAttributeEditor definition={definition}>
                                {(filter, errors) =>
                                    <React.Fragment>
                                        <Button variant="info" className="me-2"
                                            type="button"
                                            onClick={() => save(filter)}
                                            disabled={errors.length > 0 || loading}
                                            aria-label="Save changes to the custom attribute. You will return to the attribute list">
                                            <FontAwesomeIcon icon={loading ? faSpinner : faSave} pulse={loading} />&nbsp;
                                        <Translate value="action.save">Save</Translate>
                                        </Button>
                                        <Button variant="secondary"
                                            type="button"
                                            onClick={() => cancel()} aria-label="Cancel changes, go back to attribute list">
                                            <Translate value="action.cancel">Cancel</Translate>
                                        </Button>
                                    </React.Fragment>
                                }
                            </MetadataAttributeEditor>
                        </MetadataForm>
                        }
                    </MetadataSchema>
                </div>
            </section>
        </div>
    );
}