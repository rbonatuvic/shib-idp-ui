import { faArrowDown, faHistory } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

import Translate from '../../i18n/components/translate';

import { MetadataObjectContext } from '../hoc/MetadataSelector';
import { MetadataHeader } from './MetadataHeader';
import { MetadataConfiguration } from './MetadataConfiguration';


import { useMetadataConfiguration } from '../hooks/configuration';
import { MetadataViewToggle } from './MetadataViewToggle';

export function MetadataOptions () {

    const metadata = React.useContext(MetadataObjectContext);

    const { type, id } = useParams();

    const configuration = useMetadataConfiguration([metadata]);

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
                            <button className="btn btn-link" onClick={() => console.log("onScrollTo('filters')")}>
                                <FontAwesomeIcon icon={faArrowDown} />&nbsp;
                                <Translate value="label.filters">Filters</Translate>
                            </button>
                        }
                    </div>
                    <MetadataViewToggle />
                </div>
                <MetadataConfiguration configuration={ configuration } />
            </div>
        </>
    );
}