import React from 'react';
import { faCogs, faExclamationTriangle, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory, useParams, Prompt } from 'react-router';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import Translate from '../../i18n/components/translate';
import { MetadataFormContext, setFormDataAction, setFormErrorAction } from '../hoc/MetadataFormContext';
import { MetadataDefinitionContext, MetadataSchemaContext, useMetadataDefinitionValidator } from '../hoc/MetadataSchema';

import { MetadataEditorForm } from './MetadataEditorForm';
import { MetadataEditorNav } from './MetadataEditorNav';
import { getMetadataPath, useMetadataEntities, useMetadataUpdater } from '../hooks/api';
import { NavLink } from 'react-router-dom';
import { useTranslator } from '../../i18n/hooks';
import API_BASE_PATH from '../../App.constant';
import { MetadataObjectContext } from '../hoc/MetadataSelector';
import { FilterableProviders } from '../domain/provider';
import { checkChanges } from '../hooks/utility';
import { createNotificationAction, NotificationTypes, useNotificationDispatcher } from '../../notifications/hoc/Notifications';
import { useUserGroup } from '../../core/user/UserContext';

export function MetadataEditor ({ restore, current, reload }) {

    const translator = useTranslator();
    const group = useUserGroup();

    const { type, id, section } = useParams();

    const { update, loading } = useMetadataUpdater(`${ API_BASE_PATH }${getMetadataPath(type)}`, current, reload);

    const notificationDispatch = useNotificationDispatcher();

    const { data } = useMetadataEntities(type, {}, []);
    const history = useHistory();
    const definition = React.useContext(MetadataDefinitionContext);
    const schema = React.useContext(MetadataSchemaContext);
    const base = React.useContext(MetadataObjectContext);

    const { state, dispatch } = React.useContext(MetadataFormContext);
    const { metadata, errors } = state;
    const onChange = (changes) => {
        dispatch(setFormDataAction(changes.formData));
        dispatch(setFormErrorAction(changes.errors));
        setBlocking(checkChanges(metadata, changes.formData));
    };

    function save(metadata) {
        update(`/${id}`, definition.parser(metadata, base))
            .then(() => {
                gotoDetail({ refresh: true });
            })
            .catch((err) => {
                notificationDispatch(
                    createNotificationAction(`${err.errorCode > 1 ? `${err.errorCode} - ` : ''} ${translator(err.errorMessage)}`, err.errorCode === 1 ? NotificationTypes.INFO : NotificationTypes.ERROR)
                );
                if (err.errorCode === 1) {
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                }
            });
    };

    const cancel = () => {
        setBlocking(false);
        setTimeout(() => gotoDetail());
    };

    const gotoDetail = (state = null) => {
        setBlocking(false);
        history.push(`/metadata/${type}/${id}`, state);
    };

    const onNavigate = (path) => {
        const resetBlock = blocking;
        setBlocking(false);
        setTimeout(() => {
            history.push(restore ? `../${path}/edit` : path);
            setBlocking(resetBlock);
        });
    };

    const [blocking, setBlocking] = React.useState(false);

    const validator = useMetadataDefinitionValidator(data, current, group);

    const warnings = definition.warnings && definition.warnings(metadata);

    const canFilter = restore ? false : FilterableProviders.indexOf(definition.type) > -1;

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
                                {canFilter && <NavLink className="dropdown-item"
                                    to="../filter/list"
                                    aria-label={translator('label.filter-list')}
                                    role="button">
                                    <Translate value="label.filter-list"></Translate>
                                </NavLink>}
                            </MetadataEditorNav>
                        </div>
                        <div className="col-6 col-lg-3 order-2 text-right">
                            <Button
                                variant="info"
                                type="button"
                                onClick={() => save(metadata)}
                                disabled={errors.length > 0 || loading}
                                aria-label="Save changes to the metadata source. You will return to the dashboard">
                                <FontAwesomeIcon icon={loading ? faSpinner : faSave} pulse={loading } />&nbsp;
                                <Translate value="action.save">Save</Translate>
                            </Button>
                            &nbsp;
                            <Button variant="secondary"
                                type="button"
                                onClick={() => cancel()} aria-label="Cancel changes, go back to dashboard">
                                <Translate value="action.cancel">Cancel</Translate>
                            </Button>
                        </div>
                        <div className="col-xs-12 col-lg-9 order-lg-1 order-3 align-items-start">
                            {warnings && warnings.hasOwnProperty(section) &&
                                <Alert variant="danger" className="align-self-start alert-compact mt-3 mt-lg-0">
                                    {warnings[section].map((w, widx) =>
                                        <p className="m-0" key={widx}>
                                            <FontAwesomeIcon icon={faExclamationTriangle} size="lg" className="mr-2" />
                                            <Translate value={w} />
                                        </p>
                                    )}
                                </Alert>
                            }
                            {errors.length > 0 &&
                                <Alert variant="danger" className="align-self-start alert-compact mt-3 mt-lg-0">
                                    <p className="m-0">
                                        <FontAwesomeIcon icon={faExclamationTriangle} size="lg" className="mr-2" />
                                        <Translate value="message.editor-invalid" />
                                    </p>
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
                                {canFilter && <NavLink className="nav-link"
                                    to="../filter/list"
                                    aria-label={translator('label.filter-list')}
                                    role="button">
                                    <Translate value="label.filter-list"></Translate>
                                </NavLink> }
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