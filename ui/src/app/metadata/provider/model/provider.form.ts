import { Wizard, WizardStep } from '../../../wizard/model';
import { MetadataProvider } from '../../domain/model';
import { Metadata } from '../../domain/domain.type';
import { BaseMetadataProviderEditor } from './base.provider.form';

export const MetadataProviderWizard: Wizard<MetadataProvider> = {
    ...BaseMetadataProviderEditor,
    label: 'MetadataProvider',
    type: 'MetadataProvider',
    steps: [
        {
            id: 'new',
            label: 'label.select-metadata-provider-type',
            index: 1,
            initialValues: [],
            schema: 'assets/schema/provider/metadata-provider.schema.json',
            fields: [
                'name',
                '@type'
            ],
            fieldsets: [
                {
                    type: 'section',
                    class: ['col-12'],
                    fields: [
                        'name',
                        '@type'
                    ]
                }
            ]
        }
    ] as WizardStep[]
};
