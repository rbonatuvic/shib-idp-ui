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
    fields?: string[];
    fieldsets?: WizardFieldset[];
    summary?: boolean;
}

export interface WizardFieldset {
    type: string;
    class?: string[];
    fields: (string | WizardFieldsubset)[];
}

export interface WizardValue {
    key: string;
    value: any;
}

export interface WizardFieldsubset {
    parent: string;
    children: string[];
}
