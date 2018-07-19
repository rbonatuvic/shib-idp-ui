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
            label: 'Select Metadata Provider Type',
            index: 1,
            initialValues: [],
            schema: 'assets/schema/provider/metadata-provider.schema.json'
        }
    ] as WizardStep[]
};
