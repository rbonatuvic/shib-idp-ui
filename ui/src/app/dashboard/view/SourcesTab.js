import React from 'react';
import Translate from '../../i18n/components/translate';

import SourceList from '../../metadata/domain/source/component/SourceList';
import { useMetadataEntities } from '../../metadata/hooks/api';
import { Search } from '../component/Search';

const searchProps = ['serviceProviderName', 'entityId', 'createdBy'];

export function SourcesTab () {

    const [sources, setSources] = React.useState([]);

    const { get, response } = useMetadataEntities('source', {
        cachePolicy: 'no-cache'
    });

    async function loadSources() {
        const sources = await get('');
        if (response.ok) {
            setSources(sources);
        }
    }

    const updateSources = () => loadSources();

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => { loadSources() }, []);

    return (
        <section className="section">
            <div className="section-body border border-top-0 border-primary">
                <div className="section-header bg-primary p-2 text-light">
                    <span className="lead">
                        <Translate value="label.current-metadata-sources">Current Metadata Sources</Translate>
                    </span>
                </div>
                <div className="p-3">
                    <Search entities={sources} searchable={searchProps}>
                        {(searched) => <SourceList entities={ searched } onDelete={ updateSources }></SourceList>}
                    </Search>
                </div>
            </div>
        </section>
    );
}