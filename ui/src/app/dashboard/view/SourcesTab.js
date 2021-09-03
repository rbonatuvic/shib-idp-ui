import React from 'react';
import { MetadataActions } from '../../admin/container/MetadataActions';
import Translate from '../../i18n/components/translate';

import SourceList from '../../metadata/domain/source/component/SourceList';
import { useMetadataEntities, useMetadataEntity } from '../../metadata/hooks/api';
import { Search } from '../component/Search';

import { NotificationContext, createNotificationAction } from '../../notifications/hoc/Notifications';

const searchProps = ['serviceProviderName', 'entityId', 'createdBy'];

export function SourcesTab () {

    const { dispatch } = React.useContext(NotificationContext);

    const [sources, setSources] = React.useState([]);

    const { get, response } = useMetadataEntities('source', {
        cachePolicy: 'no-cache'
    });

    const updater = useMetadataEntity('source', {
        cachePolicy: 'no-cache'
    })

    async function loadSources() {
        const sources = await get('');
        if (response.ok) {
            setSources(sources);
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => { loadSources() }, []);

    async function changeSourceGroup(source, group) {
        await updater.put(`/${source.id}`, {
            ...source,
            idOfOwner: group
        });
        if (updater.response.ok) {
            dispatch(createNotificationAction(`Updated group successfully.`));
            loadSources();
        }
    }

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
                        {(searched) =>
                            <MetadataActions type="source">
                                {(enable, remove) =>
                                    <SourceList
                                        entities={searched}
                                        onDelete={(id) => remove(id, loadSources)}
                                        onEnable={(s, e) => enable(s, e, loadSources) }
                                        onChangeGroup={changeSourceGroup} />
                                }
                            </MetadataActions>
                        }
                    </Search>
                </div>
            </div>
        </section>
    );
}
