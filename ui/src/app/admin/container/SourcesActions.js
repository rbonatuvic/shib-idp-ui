import React from 'react';
import SourceList from '../../metadata/domain/source/component/SourceList';
import { useMetadataEntity } from '../../metadata/hooks/api';

export function SourcesActions ({sources, reloadSources}) {

    const { del, response } = useMetadataEntity('source', {
        cachePolicy: 'no-cache'
    });

    async function deleteSource(id) {
        await del(`/${id}`);
        if (response.ok) {
            reloadSources();
        }
    }

    return (
        <SourceList entities={sources} onDelete={ deleteSource } />
    );
}