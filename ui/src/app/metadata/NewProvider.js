import React from 'react';
import Translate from '../i18n/components/translate';
import { MetadataSchema } from './hoc/MetadataSchema';
import { MetadataWizard } from './view/MetadataWizard';

export function NewProvider() {

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
                    <MetadataSchema type={'provider'}>
                        <MetadataWizard type="provider" />
                    </MetadataSchema>
                </div>
            </section>
        </div>
    );
}