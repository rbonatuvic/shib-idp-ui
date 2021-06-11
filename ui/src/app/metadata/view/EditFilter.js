import React from 'react';
import { faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'react-bootstrap/Button';

import { Prompt, useHistory, useParams } from 'react-router';
import Translate from '../../i18n/components/translate';
import { MetadataFilterEditor } from '../editor/MetadataFilterEditor';
import { MetadataForm } from '../hoc/MetadataFormContext';
import { MetadataSchema } from '../hoc/MetadataSchema';
import { getMetadataPath, useMetadataUpdater } from '../hooks/api';
import { useMetadataFilterObject } from '../hoc/MetadataFilterSelector';
import API_BASE_PATH from '../../App.constant';

export function EditFilter() {

    const { id, filterId } = useParams();
    const filter = useMetadataFilterObject();
    const history = useHistory();

    const { update, loading } = useMetadataUpdater(`${API_BASE_PATH}${getMetadataPath('provider')}/${id}/Filters/${filterId}`, filter);

    const [blocking, setBlocking] = React.useState(false);

    const onNavigate = (path) => {
        const resetBlock = blocking;
        setBlocking(false);
        setTimeout(() => {
            history.push(path);
            setBlocking(resetBlock);
        });
    };

    function save(metadata) {
        setBlocking(false);
        update(``, metadata).then(() => {
            gotoDetail({ refresh: true });
        }).catch(() => {
            window.location.reload();
        });
    };

    const cancel = () => {
        setBlocking(false);
        setTimeout(() => gotoDetail());
    };

    const gotoDetail = (state = null) => {
        setBlocking(false);
        history.push(`/metadata/provider/${id}`, state);
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
                <div className="section-header bg-info px-4 py-2 text-white">
                    <span className="display-6"><Translate value="label.edit-filter">Edit filter</Translate></span>
                </div>
                <div className="section-body p-4 border border-top-0 border-info">
                        <MetadataSchema type={filter['@type']}>
                            <MetadataForm initial={filter}>
                                <React.Fragment>
                                    <div className="container-fluid">
                                        <div className="form-inline">
                                            <label htmlFor="staticType" className="mr-3">Filter Type</label>
                                            <input type="text" readOnly disabled className="form-control" id="staticType" value={filter['@type']} />
                                        </div>
                                    </div>
                                    <hr />
                                <MetadataFilterEditor onNavigate={onNavigate } block={ (b) => setBlocking(b) }>
                                        {(filter, isInvalid) =>
                                            <div className="d-flex justify-content-end">
                                                <Button variant="info" className="mr-2"
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
                                            </div>
                                        }
                                    </MetadataFilterEditor>
                                </React.Fragment>
                            </MetadataForm>
                        </MetadataSchema>
                </div>
            </section>
        </div>
    );
}