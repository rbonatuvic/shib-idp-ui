import React from 'react';

import { useMetadataEntities } from '../../metadata/hooks/api';
import Translate from '../../i18n/components/translate';
import ProviderList from '../../metadata/domain/provider/component/ProviderList';
import {Search} from '../component/Search';
import { Ordered } from '../component/Ordered';
import { useIsAdmin } from '../../core/user/UserContext';
import { Alert } from 'reactstrap';

const searchProps = ['name', '@type', 'createdBy'];

export function ProvidersTab () {

    const [providers, setProviders] = React.useState([]);

    const { get, response } = useMetadataEntities('provider');

    async function loadProviders() {
        const providers = await get('/')
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
                        <Ordered type="provider" entities={providers}>
                            {(ordered, first, last, onOrderUp, onOrderDown) =>
                            <Search entities={ordered} searchable={searchProps}>
                                {(searched) => <ProviderList
                                    entities={searched}
                                    reorder={providers.length === searched.length}
                                    first={first}
                                    last={last}
                                    onOrderUp={onOrderUp}
                                    onOrderDown={onOrderDown}></ProviderList>}
                            </Search>
                            }
                        </Ordered>
                    </div>
                </>
                :
                <Alert color="danger">Access Denied</Alert>}
            </div>
        </section>
    );
}