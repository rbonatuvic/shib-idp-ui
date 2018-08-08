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
}

export interface WizardValue {
    key: string;
    value: any;
}
