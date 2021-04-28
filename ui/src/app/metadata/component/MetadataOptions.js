import React from 'react';
import { faArrowDown, faHistory, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useHistory, useParams } from 'react-router-dom';

import { scroller } from 'react-scroll';

import Translate from '../../i18n/components/translate';

import { MetadataObjectContext } from '../hoc/MetadataSelector';
import { MetadataHeader } from './MetadataHeader';
import { MetadataConfiguration } from './MetadataConfiguration';


import { useMetadataConfiguration } from '../hooks/configuration';
import { MetadataViewToggle } from './MetadataViewToggle';
import { DeleteSourceConfirmation } from '../domain/source/component/DeleteSourceConfirmation';

export function MetadataOptions () {

    const metadata = React.useContext(MetadataObjectContext);
    const history = useHistory();

    const { type, id } = useParams();

    const configuration = useMetadataConfiguration([metadata]);

    const onScrollTo = (element, offset = 0) => {
        scroller.scrollTo(element, {
            duration: 500,
            smooth: true,
            offset
        });
    };

    const redirectOnDelete = () => history.push('/dashboard');

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
                    {type === 'source' &&
                        <button className="btn btn-outline btn-sm btn-danger align-self-start"
                            disabled={metadata.serviceEnabled}
                            onClick={() => onDeleteSource(metadata.id, redirectOnDelete)}>
                            <Translate value="action.delete" />
                            <FontAwesomeIcon icon={faTrash} className="ml-2" />
                        </button>
                    }
                </MetadataHeader>
                <div className="px-3 my-3 d-flex justify-content-between" id="navigation">
                    <div>
                        <Link className="btn btn-link" to={`/metadata/${type}/${id}/configuration/history`}>
                            <FontAwesomeIcon icon={ faHistory } />&nbsp;
                            <Translate value="action.version-history">Version History</Translate>
                        </Link>
                        {type === 'provider' &&
                            <button className="btn btn-link" onClick={() => onScrollTo('filters')}>
                                <FontAwesomeIcon icon={faArrowDown} />&nbsp;
                                <Translate value="label.filters">Filters</Translate>
                            </button>
                        }
                    </div>
                    <MetadataViewToggle />
                </div>
                <MetadataConfiguration configuration={ configuration } />
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
                                        <i className="fa fa-gear"></i>&nbsp;
                                        <Translate value="action.add-filter">Add Filter</Translate>
                                    </Link>
                                </div>
                            </div>
                            {/*<filter-configuration-list
                                (onUpdateOrderDown)="updateOrderDown($event)"
                                (onUpdateOrderUp)="updateOrderUp($event)"
                                (onRemove)="removeFilter($event)"
                            [filters]="filters$ | async"></filter-configuration-list>*/}
                        </>
                    }
                </div>
                <button className="btn btn-link" onClick={ () => onScrollTo('header', -60) }>
                    <i className="fa fa-chevron-up sr-hidden"></i>&nbsp;
                    <Translate value="action.back-to-top">Back to Top</Translate>
                </button>
            </div>
            </>}
        </DeleteSourceConfirmation>
    );
}