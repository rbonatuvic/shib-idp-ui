import { faCogs, faExclamationTriangle, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useParams } from 'react-router';
import Translate from '../../i18n/components/translate';
import { MetadataDefinitionContext, MetadataSchemaContext } from '../hoc/MetadataSchema';

import { MetadataObjectContext } from '../hoc/MetadataSelector';
import { MetadataEditorForm } from './MetadataEditorForm';
import { MetadataEditorNav } from './MetadataEditorNav';

export function MetadataEditor () {

    const { type, id, section } = useParams();

    const [current, setCurrent] = React.useState({});

    React.useEffect(() => {
        setCurrent({});
    }, []);

    const metadata = React.useContext(MetadataObjectContext);
    const definition = React.useContext(MetadataDefinitionContext);
    const schema = React.useContext(MetadataSchemaContext);

    const [invalid, setInvalid] = React.useState(false);
    const [saving, setSaving] = React.useState(false);

    const save = () => {
        console.log('save!');
    };

    const cancel = () => {
        console.log('cancel!');
    };

    return (
        <div className="container-fluid p-3">
            <section className="section" aria-label={`Edit metadata ${type} - ${metadata.serviceProviderName || metadata.name}`} tabIndex="0">
                <div className="section-header bg-info p-2 text-white">
                    <div className="row justify-content-between">
                        <div className="col-md-12">
                            <span className="display-6">
                                <FontAwesomeIcon icon={faCogs} />&nbsp;
                                Edit metadata {type} - {metadata.serviceProviderName || metadata.name}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="section-body p-4 border border-top-0 border-info">
                    <div className="row">
                        <div className="col-6 d-lg-none order-1">
                            <MetadataEditorNav
                                definition={definition}
                                current={section}
                                base={`/metadata/${type}/${id}/edit`}
                                format='dropdown'>
                            </MetadataEditorNav>
                        </div>
                        <div className="col-6 col-lg-3 order-2 text-right">
                            <button className="btn btn-info"
                                type="button"
                                onClick={() => save()}
                                disabled={invalid || saving}
                                aria-label="Save changes to the metadata source. You will return to the dashboard">
                                    <FontAwesomeIcon icon={saving ? faSpinner : faSave} pulse={ saving } />&nbsp;
                                <Translate value="action.save">Save</Translate>
                            </button>
                            &nbsp;
                            <button className="btn btn-secondary"
                                type="button"
                                onClick={() => cancel()} aria-label="Cancel changes, go back to dashboard">
                                <Translate value="action.cancel">Cancel</Translate>
                            </button>
                        </div>
                        <div className="col-xs-12 col-lg-9 order-lg-1 order-3">
                            {invalid && <div className="alert alert-danger alert-compact mt-3 mt-lg-0">
                                <FontAwesomeIcon icon={faExclamationTriangle} aria-hidden="true" />
                                <Translate value="message.editor-invalid">All forms must be valid before changes can be saved!</Translate>
                            </div>}
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-lg-3 d-none d-lg-block">
                            <MetadataEditorNav
                                definition={definition}
                                current={ section }
                                base={`/metadata/${type}/${id}/edit`}
                                format='tabs'>
                                
                            </MetadataEditorNav>
                        </div>
                        <div className="col-lg-6">
                            <MetadataEditorForm metadata={metadata} definition={definition} schema={schema} current={section} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}