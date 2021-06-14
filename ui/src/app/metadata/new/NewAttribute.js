import React from 'react';
import { faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'react-bootstrap/Button';

import { Prompt, useHistory } from 'react-router';
import Translate from '../../i18n/components/translate';
import { MetadataAttributeEditor } from '../editor/MetadataAttributeEditor';
import { useMetadataAttribute } from '../hooks/api';

import {CustomAttributeDefinition} from '../domain/attribute/CustomAttributeDefinition';
import MetadataSchema from '../hoc/MetadataSchema';
import { MetadataForm } from '../hoc/MetadataFormContext';

export function NewAttribute() {
    const history = useHistory();

    const definition = CustomAttributeDefinition;

    const { post, response, loading } = useMetadataAttribute({});

    const [blocking, setBlocking] = React.useState(false);

    async function save(metadata) {
        await post(``, definition.parser(metadata));
        if (response.ok) {
            gotoDetail({ refresh: true });
        }
    };

    const cancel = () => {
        gotoDetail();
    };

    const gotoDetail = (state = null) => {
        setBlocking(false);
        history.push(`/metadata/attributes`, state);
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
                            <span className="display-6"><Translate value="label.new-attribute">Add a new metadata attribute</Translate></span>
                        </div>
                    </div>
                </div>
                <div className="section-body p-4 border border-top-0 border-info">
                    <MetadataSchema type={CustomAttributeDefinition}>
                        <MetadataForm>
                            <MetadataAttributeEditor definition={definition}>
                                {(filter, errors) =>
                                    <React.Fragment>
                                        <Button variant="info" className="mr-2"
                                            type="button"
                                            onClick={() => save(filter)}
                                            disabled={errors.length > 0 || loading}
                                            aria-label="Save changes to the metadata source. You will return to the dashboard">
                                            <FontAwesomeIcon icon={loading ? faSpinner : faSave} pulse={loading} />&nbsp;
                                        <Translate value="action.save">Save</Translate>
                                        </Button>
                                        <Button variant="secondary"
                                            type="button"
                                            onClick={() => cancel()} aria-label="Cancel changes, go back to dashboard">
                                            <Translate value="action.cancel">Cancel</Translate>
                                        </Button>
                                    </React.Fragment>
                                }
                            </MetadataAttributeEditor>
                        </MetadataForm>
                    </MetadataSchema>
                </div>
            </section>
        </div>
    );
}