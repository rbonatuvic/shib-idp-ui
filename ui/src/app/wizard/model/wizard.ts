import { MetadataProvider } from '../../metadata/domain/model';

export interface Wizard<T> {
    label: string;
    type: string;
    steps: WizardStep[];
}

export interface WizardStep {
    id: string;
    label: string;
    initialValues?: WizardValue[];
    schema: string;
    index: number;
    parser?(changes: Partial<MetadataProvider>, schema: any);
}

export interface WizardValue {
    key: string;
    value: any;
}
