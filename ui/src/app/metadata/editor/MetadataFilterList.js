import React from 'react';
import { faArrowLeft, faCogs, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory, useParams } from 'react-router-dom';

import Translate from '../../i18n/components/translate';
import { MetadataDefinitionContext, MetadataSchemaContext } from '../hoc/MetadataSchema';

import { MetadataEditorNav } from './MetadataEditorNav';
import { MetadataFilterEditorList } from '../domain/filter/component/MetadataFilterEditorList';
import { MetadataFilters } from '../domain/filter/component/MetadataFilters';
import { MetadataFilterTypes } from '../domain/filter';
import { Link, NavLink } from 'react-router-dom';
import { MetadataObjectContext } from '../hoc/MetadataSelector';
import { useTranslator } from '../../i18n/hooks';

export function MetadataFilterList() {

    const { type, id, section } = useParams();

    const translator = useTranslator();

    const history = useHistory();
    const definition = React.useContext(MetadataDefinitionContext);
    const schema = React.useContext(MetadataSchemaContext);
    const current = React.useContext(MetadataObjectContext);

    const onNavigate = (path) => {
        history.push(`../edit/${path}`);
    };

    return (
        <div className="container-fluid p-3">
            <section className="section" aria-label={`Edit metadata ${type} - ${current.name}`} tabIndex="0">
                <div className="section-header bg-info p-2 text-white">
                    <div className="row justify-content-between">
                        <div className="col-md-12">
                            <span className="lead">
                                <FontAwesomeIcon icon={faCogs} />&nbsp;
                                Edit metadata {type} - {current.name}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="section-body p-4 border border-top-0 border-info">
                    <div className="d-flex justify-content-between w-100">
                        <Link className="btn btn-link" to="../configuration/options">
                            <FontAwesomeIcon icon={faArrowLeft} />&nbsp;
                            Return to Provider
                        </Link>
                        <div className="d-lg-none">
                            <MetadataEditorNav
                                onNavigate={onNavigate}
                                definition={definition}
                                current={section}
                                base={`/metadata/${type}/${id}/edit`}
                                format='dropdown'>
                                <NavLink className="dropdown-item"
                                    to="../filter/list"
                                    aria-label={translator('label.filter-list')}
                                    role="button">
                                    <Translate value="label.filter-list"></Translate>
                                </NavLink>
                            </MetadataEditorNav>
                        </div>
                        <div className="d-flex justify-content-end ms-auto">
                            <Link to="./new" className="btn btn-success">
                                <FontAwesomeIcon icon={faPlus} />&nbsp;
                                <Translate value="action.add-filter">Add Filter</Translate>
                            </Link>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-lg-3 d-none d-lg-block">
                            <MetadataEditorNav
                                onNavigate={onNavigate}
                                definition={definition}
                                current={section}
                                base={`/metadata/${type}/${id}/edit`}
                                format='tabs'>
                                <NavLink className="nav-link"
                                    to="../filter/list"
                                    aria-label={translator('label.filter-list')}
                                    role="button">
                                    <Translate value="label.filter-list"></Translate>
                                </NavLink>
                            </MetadataEditorNav>
                        </div>
                        <div className="col-lg-9">
                            {definition && schema && current &&
                                <MetadataFilters providerId={current.resourceId} types={MetadataFilterTypes}>
                                    {(filters, onUpdate, onDelete, onEnable, loading) =>
                                        <MetadataFilterEditorList
                                            editable={true}
                                            loading={loading}
                                            provider={current}
                                            filters={filters}
                                            onEnable={onEnable}
                                            onUpdate={onUpdate}
                                            onDelete={onDelete} />
                                    }
                                </MetadataFilters>
                            }
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}