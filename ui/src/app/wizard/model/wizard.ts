export interface Wizard<T> {
    label: string;
    type: string;
    steps: WizardStep[];
    translate: {
        parser(changes: Partial<T>, schema?: any),
        formatter(changes: Partial<T>, schema?: any)
    };

    getValidators?(params: any): { [key: string]: any };
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
