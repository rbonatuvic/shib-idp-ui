import React from 'react';
import { faArrowDown, faArrowUp, faHistory, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
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
import { DeleteSourceConfirmation } from '../domain/source/component/DeleteSourceConfirmation';
import { MetadataFilters } from '../domain/filter/component/MetadataFilters';
import { MetadataFilterConfigurationList } from '../domain/filter/component/MetadataFilterConfigurationList';
import { MetadataFilterTypes } from '../domain/filter';
import { useMetadataSchema } from '../hooks/schema';

export function MetadataOptions () {

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

    return (
        <DeleteSourceConfirmation>
            {(onDeleteSource) =>
            <>
            <h2 className="mb-4" id="header">
                <Translate value={`label.${type}-configuration`}>[{type}] configuration</Translate>
            </h2>
            <div className="container">
                <MetadataHeader
                    current={true}
                    enabled={type === 'source' ? metadata.serviceEnabled : metadata.enabled}
                    model={metadata}>
                    {type === 'source' && onDeleteSource &&
                        <Button className="btn btn-outline btn-sm btn-danger align-self-start"
                            disabled={metadata.serviceEnabled}
                            onClick={() => onDeleteSource(metadata.id, redirectOnDelete)}>
                            <Translate value="action.delete" />
                            <FontAwesomeIcon icon={faTrash} className="ml-2" />
                        </Button>
                    }
                </MetadataHeader>
                <div className="px-3 my-3 d-flex justify-content-between" id="navigation">
                    <div>
                        <Link className="btn btn-link" to={`/metadata/${type}/${id}/configuration/history`}>
                            <FontAwesomeIcon icon={ faHistory } />&nbsp;
                            <Translate value="action.version-history">Version History</Translate>
                        </Link>
                        {type === 'provider' &&
                            <Button variant="link" onClick={() => onScrollTo('filters')}>
                                <FontAwesomeIcon icon={faArrowDown} />&nbsp;
                                <Translate value="label.filters">Filters</Translate>
                            </Button>
                        }
                    </div>
                    <MetadataViewToggle />
                </div>
                <MetadataConfiguration configuration={ configuration } onEdit={ (section) => edit(section) } />
                <div id="filters">
                    {type === 'provider' &&
                        <>
                            <div className="numbered-header d-flex justify-content-start bg-light align-items-center">
                                <h2 className="title h4 m-0 ml-2 flex-grow-1">
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
                        </>
                    }
                </div>
                <Button variant="link" onClick={ () => onScrollTo('header', -60) }>
                    <FontAwesomeIcon icon={faArrowUp} className="sr-hidden" />&nbsp;
                    <Translate value="action.back-to-top">Back to Top</Translate>
                </Button>
            </div>
            </>}
        </DeleteSourceConfirmation>
    );
}