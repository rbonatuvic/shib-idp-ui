import React from 'react';

import { useMetadataEntities } from '../../metadata/hooks/api';
import Translate from '../../i18n/components/translate';
import ProviderList from '../../metadata/provider/component/ProviderList';

export function ProvidersTab () {

    const [providers, setProviders] = React.useState([]);

    const { get, response } = useMetadataEntities('provider');

    async function loadProviders() {
        const providers = await get('/')
        if (response.ok) {
            setProviders(providers);
        }
    }

    React.useEffect(() => { loadProviders() }, []);

    return (
        <section className="section">
            <div className="section-body border border-top-0 border-primary">
                <div className="section-header bg-primary p-2 text-light">
                    <span className="lead">
                        <Translate value="label.current-metadata-providers">Current Metadata Providers</Translate>
                    </span>
                </div>
                <div className="p-3">
                    { /* search goes here */}
                    <ProviderList entities={providers}></ProviderList>

                </div>
            </div>
        </section>
    );
}