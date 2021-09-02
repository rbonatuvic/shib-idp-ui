import React from 'react';
import { faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'react-bootstrap/Button';

import { Prompt, useHistory } from 'react-router';
import Translate from '../../i18n/components/translate';

import { AttributeBundleDefinition } from '../domain/attribute/AttributeBundleDefinition';
import MetadataSchema from '../hoc/MetadataSchema';
import { MetadataForm } from '../hoc/MetadataFormContext';
import { AttributeBundleEditor } from '../editor/AttributeBundleEditor';
import { AttributeBundleApi } from '../hoc/attribute/AttributeBundleApi';

export function NewBundle() {
    const history = useHistory();

    console.log('hi')

    const definition = AttributeBundleDefinition;

    const [blocking, setBlocking] = React.useState(false);

    const cancel = () => {
        gotoDetail();
    };

    const gotoDetail = (state = null) => {
        setBlocking(false);
        history.push(`/metadata/attributes/bundles`, state);
    };

    return (
        <AttributeBundleApi>
            {(load, find, create, update, remove, loading) =>
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
                                    <span className="display-6"><Translate value="label.new-attribute-bundle">Add a new attribute bundle</Translate></span>
                                </div>
                            </div>
                        </div>
                        <div className="section-body p-4 border border-top-0 border-info">
                            <MetadataSchema type={AttributeBundleDefinition}>
                                <MetadataForm>
                                    <AttributeBundleEditor definition={definition}>
                                        {(bundle, errors) =>
                                            <React.Fragment>
                                                <Button variant="info" className="mr-2"
                                                    type="button"
                                                    onClick={() => create(bundle)}
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
                                    </AttributeBundleEditor>
                                </MetadataForm>
                            </MetadataSchema>
                        </div>
                    </section>
                </div>
            }
        </AttributeBundleApi>
    );
}