import React from 'react';
import { faArrowDown, faArrowUp, faHistory, faPlus, faToggleOff, faToggleOn, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useHistory, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { scroller } from 'react-scroll';

import Translate from '../../i18n/components/translate';

import { MetadataObjectContext } from '../hoc/MetadataSelector';
import { MetadataHeader } from '../component/MetadataHeader';
import { MetadataConfiguration } from '../component/MetadataConfiguration';
import { MetadataDefinitionContext, MetadataSchemaContext } from '../hoc/MetadataSchema';

import { useMetadataConfiguration } from '../hooks/configuration';
import { MetadataViewToggle } from '../component/MetadataViewToggle';
import { MetadataActions } from '../../admin/container/MetadataActions';
import { MetadataFilters } from '../domain/filter/component/MetadataFilters';
import { MetadataFilterConfigurationList } from '../domain/filter/component/MetadataFilterConfigurationList';
import { MetadataFilterTypes } from '../domain/filter';
import { useMetadataSchema } from '../hooks/schema';
import { FilterableProviders } from '../domain/provider';
import { useCanEnable, useIsAdmin, useIsApprover } from '../../core/user/UserContext';
import { ApprovalActions } from '../../admin/container/ApprovalActions';

export function MetadataOptions ({reload}) {

    const metadata = React.useContext(MetadataObjectContext);
    const definition = React.useContext(MetadataDefinitionContext);
    const schema = React.useContext(MetadataSchemaContext);
    const processed = useMetadataSchema(definition, schema);
    const history = useHistory();

    const { type, id } = useParams();

    const configuration = useMetadataConfiguration([metadata], processed, definition);

    const onScrollTo = (element, offset = 0) => {
        scroller.scrollTo(element, {
            duration: 500,
            smooth: true,
            offset
        });
    };

    const redirectOnDelete = () => history.push('/dashboard');

    const edit = (section) => {
        history.push(`/metadata/${type}/${id}/edit/${section}`);
    }

    const canFilter = FilterableProviders.indexOf(definition.type) > -1;

    const enabled = type === 'source' ? metadata.serviceEnabled : metadata.enabled;

    const canEnable = useCanEnable()(metadata.approved);
    const isAdmin = useIsAdmin();
    const canApprove = useIsApprover();

    return (
        <MetadataActions type={type}>
            {(enable, remove) =>
            <>
            <h2 className="mb-4" id="header">
                <Translate value={`label.${type}-configuration`}>[{type}] configuration</Translate>
            </h2>
            <div className="container">
                <MetadataHeader
                    current={true}
                    enabled={type === 'source' ? metadata.serviceEnabled : metadata.enabled}
                    model={metadata}
                    showGroup={type === 'source'}>
                    <div className="d-flex align-items-start btn-group">
                        {enable && (canEnable && metadata.approved) &&
                        <Button variant={enabled ? 'outline-secondary' : 'outline-secondary' } size="sm" className=""
                                onClick={() => enable(metadata, !enabled, reload)}>
                                     <span className=" me-1">
                                         <Translate value={enabled ? 'label.disable' : 'label.enable'} />
                                     </span>
                            <FontAwesomeIcon size="lg" icon={enabled ? faToggleOn : faToggleOff} />
                        </Button>
                        }
                        {canApprove &&
                        <ApprovalActions>
                            {(approve) => 
                            <Button variant={metadata.approved ? 'outline-success' : 'outline-success' } size="sm" className=""
                                    onClick={() => approve(metadata, !metadata.approved, reload)}>
                                        <span className=" me-1">
                                            <Translate value={metadata.approved ? 'label.disapprove' : 'label.approve'} />
                                        </span>
                                <FontAwesomeIcon size="lg" icon={metadata.approved ? faToggleOn : faToggleOff} />
                            </Button>
                            }
                        </ApprovalActions>
                        }
                        {type === 'source' && remove && isAdmin &&
                        <Button
                            size="sm"
                            variant={ 'danger' }
                            disabled={enabled}
                            onClick={() => remove(metadata.id, redirectOnDelete)}>
                            <Translate value="action.delete" />
                            <FontAwesomeIcon icon={faTrash} className="ms-2" />
                        </Button>
                        }
                    </div>
                </MetadataHeader>
                <div className="px-3 my-3 d-flex justify-content-between" id="navigation">
                    <div>
                        <Link className="btn btn-link" to={`/metadata/${type}/${id}/configuration/history`}>
                            <FontAwesomeIcon icon={ faHistory } />&nbsp;
                            <Translate value="action.version-history">Version History</Translate>
                        </Link>
                        {type === 'provider' && canFilter &&
                            <Button variant="link" onClick={() => onScrollTo('filters')}>
                                <FontAwesomeIcon icon={faArrowDown} />&nbsp;
                                <Translate value="label.filters">Filters</Translate>
                            </Button>
                        }
                    </div>
                    <MetadataViewToggle />
                </div>
                <MetadataConfiguration configuration={ configuration } onEdit={ (section) => edit(section) } />
                {type === 'provider' && canFilter &&
                    <div id="filters">
                        <div className="numbered-header d-flex justify-content-start bg-light align-items-center">
                            <h2 className="title h4 m-0 ms-2 flex-grow-1">
                                <span className="text"><Translate value="label.filters">Filters</Translate></span>
                            </h2>
                            <div className="actions px-2">
                                <Link className="btn btn-link edit-link change-view"
                                    to={`/metadata/provider/${id}/filter/new`}>
                                    <FontAwesomeIcon icon={faPlus} />&nbsp;
                                    <Translate value="action.add-filter">Add Filter</Translate>
                                </Link>
                            </div>
                        </div>
                        <MetadataFilters providerId={metadata.resourceId} types={MetadataFilterTypes}>
                            {(filters, onUpdate, onDelete, loading) =>
                                <MetadataFilterConfigurationList
                                    provider={metadata}
                                    filters={filters}
                                    onDelete={onDelete} />}
                        </MetadataFilters>
                    </div>
                }
                <Button variant="link" onClick={ () => onScrollTo('header', -60) }>
                    <FontAwesomeIcon icon={faArrowUp} className="sr-hidden" />&nbsp;
                    <Translate value="action.back-to-top">Back to Top</Translate>
                </Button>
            </div>
            </>}
        </MetadataActions>
    );
}
