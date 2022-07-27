import React from 'react';
import Translate from '../../i18n/components/translate';
import { MetadataSchema } from '../hoc/MetadataSchema';
import { useMetadataProviderTypes } from '../hooks/api';
import { MetadataWizard } from '../view/MetadataWizard';
import { MetadataProviderTypeSelector } from '../wizard/MetadataProviderTypeSelector';

export function NewProvider() {

    const { data = [], loading } = useMetadataProviderTypes({}, []);

    return (
        <div className="container-fluid p-3">
            <section className="section" aria-label="Add a new metadata provider." tabIndex="0">
                <div className="section-header bg-info p-2 text-white">
                    <div className="row justify-content-between">
                        <div className="col-md-12">
                            <span className="lead"><Translate value="label.add-a-new-metadata-provider">Add a new metadata provider</Translate></span>
                        </div>
                    </div>
                </div>
                <div className="section-body p-4 border border-top-0 border-info">
                    <MetadataProviderTypeSelector type={'provider'} types={[...data]} loading={loading}>
                        {(data, onRestart) =>
                        <MetadataSchema type={data.type} wizard={true}>
                            <MetadataWizard type="provider"
                                data={{
                                    '@type': data.type,
                                    name: data.name
                                }}
                                onCallback={onRestart} />
                        </MetadataSchema>
                        }
                    </MetadataProviderTypeSelector>
                </div>
            </section>
        </div>
    );
}