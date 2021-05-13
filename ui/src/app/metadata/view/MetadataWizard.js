import React from 'react';

import { MetadataForm } from '../hoc/MetadataFormContext';
import { MetadataSourceWizard } from '../wizard/MetadataSourceWizard';
import { MetadataProviderWizard } from '../wizard/MetadataProviderWizard';
import { Wizard } from '../wizard/Wizard';

export function MetadataWizard ({type, onShowNav}) {

    return (
        <MetadataForm>
            <Wizard>
                {type === 'source' ?
                    <MetadataSourceWizard onShowNav={onShowNav} />
                    :
                    <MetadataProviderWizard />
                }
            </Wizard>
        </MetadataForm>
    );
}