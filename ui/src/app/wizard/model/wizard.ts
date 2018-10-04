import { FormDefinition } from './form-definition';

export interface Wizard<T> extends FormDefinition<T> {
    steps: WizardStep[];
}

export interface WizardStep {
    id: string;
    label: string;
    initialValues?: WizardValue[];
    schema?: string;
    index: number;
    locked?: boolean;
    fields?: (string | WizardFieldset)[];
    summary?: boolean;
}

export interface WizardFieldset {
    type: string;
    fields: string[];
}

export interface WizardValue {
    key: string;
    value: any;
}
