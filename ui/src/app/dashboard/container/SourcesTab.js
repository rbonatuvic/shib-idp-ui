import React from 'react';
import useFetch from 'use-http';
import Translate from '../../i18n/components/translate';
import API_BASE_PATH from '../../App.constant';

import SourceList from '../../metadata/domain/source/component/SourceList';
import { useMetadataEntities } from '../../metadata/hooks/api';
import { Search } from '../component/Search';

const searchProps = ['serviceProviderName', 'entityId', 'createdBy'];

export function SourcesTab () {

    const [sources, setSources] = React.useState([]);

    const { get, del, response } = useMetadataEntities('source');

    async function loadSources() {
        const sources = await get('/')
        if (response.ok) {
            setSources(sources);
        }
    }

    async function deleteSource(id) {
        const removal = await del(`/${id}`);
        if (response.ok) {
            loadSources();
        }
    }

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
                        {(searched) => <SourceList entities={ searched } onDelete={ deleteSource }></SourceList>}
                    </Search>
                </div>
            </div>
        </section>
    );
}