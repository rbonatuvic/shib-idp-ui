import React from 'react';

import { useMetadataEntities } from '../../metadata/hooks/api';
import Translate from '../../i18n/components/translate';
import ProviderList from '../../metadata/domain/provider/component/ProviderList';
import {Search} from '../component/Search';
import { Ordered } from '../component/Ordered';
import { useIsAdmin } from '../../core/user/UserContext';
import Alert from 'react-bootstrap/Alert';
import { MetadataActions } from '../../admin/container/MetadataActions';
import Spinner from '../../core/components/Spinner';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubes } from '@fortawesome/free-solid-svg-icons';
const searchProps = ['name', '@type', 'createdBy'];

export function ProvidersTab () {

    const [providers, setProviders] = React.useState([]);

    const { get, response, loading } = useMetadataEntities('provider', {
        cachePolicy: 'no-cache'
    });

    async function loadProviders() {
        const providers = await get('')
        if (response.ok) {
            setProviders(providers);
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => { loadProviders() }, []);

    const isAdmin = useIsAdmin();

    return (
        <section className="section">
            <div className="section-body border border-top-0 border-primary">
                {isAdmin ?
                <>
                    <div className="section-header bg-primary p-2 text-light">
                        <span className="lead">
                            <Translate value="label.current-metadata-providers">Current Metadata Providers</Translate>
                        </span>
                    </div>
                    <div className="p-3">
                        <Ordered entities={providers} prop="resourceIds">
                            {(ordered, first, last, onOrderUp, onOrderDown) =>
                            <Search entities={ordered} searchable={searchProps}>
                                {(searched) =>
                                <MetadataActions type="provider">
                                    {({enable}) =>
                                        <ProviderList
                                            entities={searched}
                                            reorder={providers.length === searched.length}
                                            first={first}
                                            last={last}
                                            onEnable={(p, e) => enable(p, e, loadProviders)}
                                            onOrderUp={onOrderUp}
                                            onOrderDown={onOrderDown}>
                                                {loading && <div className="d-flex justify-content-center text-primary"><Spinner size="4x" /></div> }
                                                {(!searched || !searched.length) &&
                                                <div className="d-flex justify-content-center">
                                                    <div className="w-25 alert alert-info m-3 d-flex flex-column align-items-center">
                                                        <p className="text-center">No Metadata Providers found.</p>
                                                        <Link to="/metadata/provider/new" className="btn btn-primary" id="metadata-provider-create-btn">
                                                            <FontAwesomeIcon icon={faCubes} className="me-2" fixedWidth />
                                                            <Translate value="action.add-new-provider" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            }
                                            </ProviderList>
                                    }
                                </MetadataActions>
                                }
                            </Search>
                            }
                        </Ordered>
                    </div>
                </>
                :
                <Alert variant="danger">Access Denied</Alert>}
            </div>
        </section>
    );
}