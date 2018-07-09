import { Wizard, WizardStep } from '../../../wizard/model';
import { MetadataProvider } from '../../domain/model';
import { Metadata } from '../../domain/domain.type';

export const MetadataProviderWizard: Wizard<MetadataProvider> = {
    label: 'MetadataProvider',
    type: 'MetadataProvider',
    translate: {
        parser: changes => changes,
        formatter: model => model
    },
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
