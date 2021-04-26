import { faArrowDown, faHistory } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

import Translate from '../../i18n/components/translate';

import { MetadataObjectContext } from '../hoc/MetadataSelector';
import { MetadataHeader } from './MetadataHeader';

export function MetadataOptions () {

    const metadata = React.useContext(MetadataObjectContext);

    const { type, id } = useParams();

    return (
        <>
            <h2 className="mb-4">
                <Translate value={`label.${type}-configuration`}>[{type}] configuration</Translate>
            </h2>
            <div className="container">
                <MetadataHeader
                    current={true}
                    enabled={type === 'source' ? metadata.enabled : metadata.serviceEnabled}
                    model={metadata} />
                <div className="px-3 my-3 d-flex justify-content-between" id="navigation">
                    <div>
                        <Link className="btn btn-link" to={`/metadata/${type}/${id}/configuration/history`}>
                            <FontAwesomeIcon icon={ faHistory } />&nbsp;
                            <Translate value="action.version-history">Version History</Translate>
                        </Link>
                        {type === 'provider' &&
                            <button className="btn btn-link" onClick={"onScrollTo('filters')"}>
                                <FontAwesomeIcon icon={faArrowDown} />&nbsp;
                                <Translate value="label.filters">Filters</Translate>
                            </button>
                        }
                    </div>
                    {/*<div *ngIf="hasXml$ | async">
                    <div className="btn-group" role="group" aria-label="Options selected">
                        <a className="btn" routerLink="../options" routerLinkActive="btn-primary" aria-pressed="true">
                            <span className="sr-only"><Translate value="action.toggle-view">Toggle view:</Translate></span>
                            Options
                        </a>
                        <a className="btn" routerLink="../xml" routerLinkActive="btn-primary">
                            <span className="sr-only"><Translate value="action.toggle-view">Toggle view:</Translate></span>
                            XML
                        </a>
                    </div>
                </div>*/}
                </div>
            </div>
        </>
    );
}