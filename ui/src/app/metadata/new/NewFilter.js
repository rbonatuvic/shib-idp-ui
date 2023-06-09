import React from 'react';
import { faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'react-bootstrap/Button';
import { Prompt, useHistory, useParams } from 'react-router-dom';
import Translate from '../../i18n/components/translate';
import { MetadataFilterEditor } from '../editor/MetadataFilterEditor';
import { MetadataForm } from '../hoc/MetadataFormContext';
import { MetadataSchema } from '../hoc/MetadataSchema';
import { useMetadataFilters, useMetadataFilterTypes } from '../hooks/api';
import { MetadataFilterTypeSelector } from '../wizard/MetadataFilterTypeSelector';
import { createNotificationAction, NotificationTypes } from '../../store/notifications/NotificationSlice';
import { useDispatch } from 'react-redux';

export function NewFilter() {

    const { id } = useParams();
    const history = useHistory();
    const types = useMetadataFilterTypes();
    const dispatch = useDispatch();

    const { post, response, loading } = useMetadataFilters(id, {});

    const [blocking, setBlocking] = React.useState(false);

    
    async function save(metadata) {
        const resp = await post(``, metadata);
        if (response.ok) {
            dispatch(createNotificationAction('Filter saved'));
            gotoDetail({ refresh: true });
        } else {
            dispatch(createNotificationAction(resp.cause, NotificationTypes.DANGER));
        }
    };

    const cancel = () => {
        gotoDetail();
    };

    const gotoDetail = (state = null) => {
        setBlocking(false);
        setTimeout(() => {
            history.push(`/metadata/provider/${id}`, state);
        });
    };

    const onNavigate = (path) => {
        const resetBlock = blocking;
        setBlocking(false);
        setTimeout(() => {
            history.push(path);
            setBlocking(resetBlock);
        });
    };

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
                            <span className="lead"><Translate value="label.new-filter">Add a new metadata filter</Translate></span>
                        </div>
                    </div>
                </div>
                <div className="section-body p-4 border border-top-0 border-info">
                    <MetadataFilterTypeSelector types={types}>
                        {(type, base) =>
                            <MetadataSchema type={type}>
                                <MetadataForm initial={base}>
                                    <MetadataFilterEditor onNavigate={onNavigate} block={(b) => setBlocking(b)}>
                                        {(filter, isInvalid) =>
                                            <div className="d-flex justify-content-end">
                                                <Button variant="info" className="me-2"
                                                    type="button"
                                                    onClick={() => save(filter)}
                                                    disabled={isInvalid || loading}
                                                    aria-label="Save changes to the metadata source. You will return to the dashboard">
                                                    <FontAwesomeIcon icon={loading ? faSpinner : faSave} pulse={loading} />&nbsp;
                                                    <Translate value="action.save">Save</Translate>
                                                </Button>
                                                <Button variant="secondary"
                                                    type="button"
                                                    onClick={() => cancel()} aria-label="Cancel changes, go back to dashboard">
                                                    <Translate value="action.cancel">Cancel</Translate>
                                                </Button>
                                            </div>}
                                    </MetadataFilterEditor>
                                </MetadataForm>
                            </MetadataSchema>
                        }
                    </MetadataFilterTypeSelector>
                </div>
            </section>
        </div>
    );
}