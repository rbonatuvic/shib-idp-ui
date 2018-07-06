export interface Wizard<T> {
    label: string;
    type: string;
    steps: WizardStep[];
    translate: {
        parser(changes: Partial<T>, schema?: any),
        formatter(changes: Partial<T>, schema?: any)
    };
}

export interface WizardStep {
    id: string;
    label: string;
    initialValues?: WizardValue[];
    schema: string;
    index: number;
}

export interface WizardValue {
    key: string;
    value: any;
}
