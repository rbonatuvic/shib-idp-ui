import { Wizard, WizardStep } from '../../../wizard/model';
import { MetadataProvider } from '../../domain/model';
import { BaseMetadataProviderEditor } from './base.provider.form';

export const MetadataProviderWizard: Wizard<MetadataProvider> = {
    ...BaseMetadataProviderEditor,
    label: 'MetadataProvider',
    type: 'MetadataProvider',
    schema: 'assets/schema/provider/metadata-provider.schema.json',
    steps: [
        {
            id: 'new',
            label: 'label.select-metadata-provider-type',
            index: 1,
            initialValues: [],
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
    ] as WizardStep[],
};
