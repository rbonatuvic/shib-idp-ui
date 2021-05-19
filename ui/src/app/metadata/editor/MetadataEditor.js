import React from 'react';
import { faCogs, faExclamationTriangle, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory, useParams, Prompt } from 'react-router';
import Alert from 'react-bootstrap/Alert';

import Translate from '../../i18n/components/translate';
import { MetadataFormContext, setFormDataAction, setFormErrorAction } from '../hoc/MetadataFormContext';
import { MetadataDefinitionContext, MetadataSchemaContext } from '../hoc/MetadataSchema';

import { MetadataEditorForm } from './MetadataEditorForm';
import { MetadataEditorNav } from './MetadataEditorNav';
import { useMetadataEntities, useMetadataEntity } from '../hooks/api';
import { MetadataObjectContext } from '../hoc/MetadataSelector';
import { NavLink } from 'react-router-dom';
import { useTranslator } from '../../i18n/hooks';

export function MetadataEditor () {

    const translator = useTranslator();

    const { type, id, section } = useParams();

    const { put, response, saving } = useMetadataEntity(type, {}, []);

    const { data } = useMetadataEntities(type, {}, []);
    const history = useHistory();
    const definition = React.useContext(MetadataDefinitionContext);
    const schema = React.useContext(MetadataSchemaContext);
    const current = React.useContext(MetadataObjectContext);

    const { state, dispatch } = React.useContext(MetadataFormContext);
    const { metadata, errors } = state;

    const onChange = (changes) => {
        dispatch(setFormDataAction(changes.formData));
        dispatch(setFormErrorAction(section, changes.errors));
        // setBlocking(true);
    };

    async function save(metadata) {
        await put(`/${id}`, definition.parser(metadata));
        if (response.ok) {
            gotoDetail({ refresh: true });
        }
    };

    const cancel = () => {
        gotoDetail();
    };

    const gotoDetail = (state = null) => {
        setBlocking(false);
        history.push(`/metadata/${type}/${id}`, state);
    };

    const onNavigate = (path) => {
        history.push(path)
    };

    const [blocking, setBlocking] = React.useState(false);

    const validator = definition.validator(data, current);

    // console.log(errors);

    return (
        <div className="container-fluid p-3">
            <Prompt
                when={blocking}
                message={location =>
                    `message.unsaved-editor`
                }
            />
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
                                onNavigate={onNavigate}
                                definition={definition}
                                current={section}
                                base={`/metadata/${type}/${id}/edit`}
                                format='dropdown'
                                errors={errors}>
                                <NavLink className="dropdown-item"
                                    to="../filter/list"
                                    aria-label={translator('label.filter-list')}
                                    role="button">
                                    <Translate value="label.filter-list"></Translate>
                                </NavLink>
                            </MetadataEditorNav>
                        </div>
                        <div className="col-6 col-lg-3 order-2 text-right">
                            <button className="btn btn-info"
                                type="button"
                                onClick={() => save(metadata)}
                                disabled={errors.length > 0 || saving}
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
                        <div className="col-xs-12 col-lg-9 order-lg-1 order-3 align-items-start">
                            {errors.length > 0 &&
                                <Alert variant="danger" className="align-self-start alert-compact mt-3 mt-lg-0">
                                    <p className="m-0"><FontAwesomeIcon icon={faExclamationTriangle} size="lg" className="mr-2" /> <Translate value="message.editor-invalid" /></p>
                                </Alert>
                            }
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-lg-3 d-none d-lg-block">
                            <MetadataEditorNav
                                onNavigate={onNavigate}
                                definition={definition}
                                current={ section }
                                base={`/metadata/${type}/${id}/edit`}
                                format='tabs'
                                errors={errors}>
                                <NavLink className="nav-link"
                                    to="../filter/list"
                                    aria-label={translator('label.filter-list')}
                                    role="button">
                                    <Translate value="label.filter-list"></Translate>
                                </NavLink>
                            </MetadataEditorNav>
                        </div>
                        <div className="col-lg-9">
                            {definition && schema && metadata &&
                            <MetadataEditorForm
                                metadata={metadata}
                                definition={definition}
                                schema={schema}
                                current={section}
                                onChange={onChange}
                                validator={ validator } />
                            }
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}