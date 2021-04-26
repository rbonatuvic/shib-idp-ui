import React from 'react';

import Translate from '../../i18n/components/translate';

export function MetadataHistory () {
    return (
        <>
            <h2 className="mb-4">
                <Translate value={`label.version-history`}>version history</Translate>
            </h2>
        </>
    );
}