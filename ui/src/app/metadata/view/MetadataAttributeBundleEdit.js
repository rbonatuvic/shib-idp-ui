import React from 'react';
import { faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from 'react-bootstrap/Button';
import { Prompt, useHistory, useParams } from 'react-router';
import Translate from '../../i18n/components/translate';
import { MetadataAttributeEditor } from '../editor/MetadataAttributeEditor';

import { AttributeBundleDefinition } from '../domain/attribute/AttributeBundleDefinition';
import MetadataSchema from '../hoc/MetadataSchema';
import { MetadataForm } from '../hoc/MetadataFormContext';
import { AttributeBundleSelector } from '../hoc/attribute/AttributeBundleSelector';
import { AttributeBundleApi } from '../hoc/attribute/AttributeBundleApi';

export function MetadataAttributeBundleEdit() {
    const { id } = useParams();
    const history = useHistory();

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
                <AttributeBundleSelector id={ id } find={find}>
                    {(bundle) => <div className="container-fluid p-3">
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
                                    <span className="display-6"><Translate value="label.edit-attribute-bundle">Edit attribute bundle</Translate></span>
                                </div>
                            </div>
                        </div>
                        <div className="section-body p-4 border border-top-0 border-info">
                            <MetadataSchema type={AttributeBundleDefinition}>
                                {bundle &&
                                    <MetadataForm initial={bundle}>
                                        <MetadataAttributeEditor definition={definition}>
                                            {(data, errors) =>
                                                <React.Fragment>
                                                    <Button variant="info" className="mr-2"
                                                        type="button"
                                                        onClick={() => update(data.resourceId, data, gotoDetail)}
                                                        disabled={errors.length > 0 || loading}
                                                        aria-label="Save changes to the bundle">
                                                        <FontAwesomeIcon icon={loading ? faSpinner : faSave} pulse={loading} />&nbsp;
                                                        <Translate value="action.save">Save</Translate>
                                                    </Button>
                                                    <Button variant="secondary"
                                                        type="button"
                                                        onClick={() => cancel()} aria-label="Cancel changes, go back to bundle list">
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
                }
            </AttributeBundleSelector>
        }
        </AttributeBundleApi>
    );
}