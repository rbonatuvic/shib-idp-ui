import React from 'react';

import { MetadataForm } from '../hoc/MetadataFormContext';
import { MetadataSourceWizard } from '../wizard/MetadataSourceWizard';
import { MetadataProviderWizard } from '../wizard/MetadataProviderWizard';
import { Wizard } from '../wizard/Wizard';

export function MetadataWizard ({type, data, onCallback}) {

    return (
        <MetadataForm initial={data}>
            <Wizard>
                {type === 'source' ?
                    <MetadataSourceWizard onShowNav={onCallback} />
                    :
                    <MetadataProviderWizard onRestart={onCallback} />
                }
            </Wizard>
        </MetadataForm>
    );
}