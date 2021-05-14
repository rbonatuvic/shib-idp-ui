import React from 'react';
import Translate from '../i18n/components/translate';
import { MetadataSchema } from './hoc/MetadataSchema';
import { useMetadataProviderTypes } from './hooks/api';
import { MetadataWizard } from './view/MetadataWizard';
import { MetadataSchemaSelector } from './wizard/MetadataSchemaSelector';

export function NewProvider() {

    const { data } = useMetadataProviderTypes({}, []);

    return (
        <div className="container-fluid p-3">
            <section className="section" aria-label="Add a new metadata source - how are you adding the metadata information?" tabIndex="0">
                <div className="section-header bg-info p-2 text-white">
                    <div className="row justify-content-between">
                        <div className="col-md-12">
                            <span className="display-6"><Translate value="label.add-a-new-metadata-provider">Add a new metadata provider</Translate></span>
                        </div>
                    </div>
                </div>
                <div className="section-body p-4 border border-top-0 border-info">
                    <MetadataSchemaSelector type={'provider'} types={data}>
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
                    </MetadataSchemaSelector>
                </div>
            </section>
        </div>
    );
}