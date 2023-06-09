import React from 'react';
import { MetadataEditor } from '../editor/MetadataEditor';
import { MetadataForm } from '../hoc/MetadataFormContext';
import { useMetadataObject } from '../hoc/MetadataSelector';
import { MetadataVersionLoader } from '../hoc/MetadataVersionLoader';

export function MetadataRestore() {

    const latest = useMetadataObject();

    return (
        <MetadataVersionLoader>
            {(metadata, loading) => <>
                {metadata &&
                <MetadataForm initial={{
                    ...metadata,
                    version: latest.version
                }}>
                    <MetadataEditor restore={true} current={{
                        ...metadata,
                        version: latest.version
                    }} />
                </MetadataForm>
                }
            </>}
        </MetadataVersionLoader>
    );
}
