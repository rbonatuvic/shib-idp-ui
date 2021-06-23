import React from 'react';
import Button from 'react-bootstrap/Button';
import { MetadataDefinitionContext, MetadataSchemaContext } from '../hoc/MetadataSchema';
import { Configuration } from '../hoc/Configuration';
import { MetadataConfiguration } from '../component/MetadataConfiguration';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faHistory, faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';

import { scroller } from 'react-scroll';

import Translate from '../../i18n/components/translate';
import { MetadataHeader } from '../component/MetadataHeader';
import { MetadataFilters } from '../domain/filter/component/MetadataFilters';
import { MetadataFilterConfigurationList } from '../domain/filter/component/MetadataFilterConfigurationList';
import { MetadataFilterTypes } from '../domain/filter';
import { useMetadataSchema } from '../hooks/schema';
import { MetadataVersionLoader } from '../hoc/MetadataVersionLoader';

export function MetadataVersion() {

    const { type, id } = useParams();

    const schema = React.useContext(MetadataSchemaContext);
    const definition = React.useContext(MetadataDefinitionContext);
    const processed = useMetadataSchema(definition, schema);

    const onScrollTo = (element, offset = 0) => {
        scroller.scrollTo(element, {
            duration: 500,
            smooth: true,
            offset
        });
    };

    return (
        <MetadataVersionLoader>
            {(metadata, loading) =>
                <>
                    {loading && <div className="d-flex justify-content-center">
                        <FontAwesomeIcon icon={faSpinner} pulse size="4x" />
                        <span className="sr-only">Loading...</span>
                    </div>}
                {metadata &&
                <Configuration entities={[metadata]} schema={processed} definition={definition}>
                    {(config) =>
                        <>
                        <h2 className="mb-4" id="header">
                            <Translate value={`label.${type}-configuration`}>[{type}] configuration</Translate>
                        </h2>
                        <div className="container">
                            <MetadataHeader
                                current={false}
                                enabled={type === 'source' ? metadata.serviceEnabled : metadata.enabled}
                                model={metadata}>
                            </MetadataHeader>
                            
                            <div className="px-3 my-3 d-flex justify-content-between align-items-center" id="navigation">
                                <div>
                                    <Link className="btn btn-link" to={`/metadata/${type}/${id}/configuration/history`}>
                                        <FontAwesomeIcon icon={faHistory} />&nbsp;
                                            <Translate value="action.version-history">Version History</Translate>
                                    </Link>
                                </div>
                            </div>
                            <MetadataConfiguration configuration={config} />
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
                                        <MetadataFilters providerId={metadata.resourceId} types={MetadataFilterTypes} filters={metadata.metadataFilters}>
                                            {(filters) => <MetadataFilterConfigurationList provider={metadata} filters={filters} editable={false} />}
                                        </MetadataFilters>
                                    </>
                                }
                            </div>
                            <Button variant="link" onClick={() => onScrollTo('header', -60)}>
                                <FontAwesomeIcon icon={faArrowUp} className="sr-hidden" />&nbsp;
                                <Translate value="action.back-to-top">Back to Top</Translate>
                            </Button>
                        </div>
                        </>
                    }
                </Configuration>
                }</>
            }
        </MetadataVersionLoader>
    );
}
