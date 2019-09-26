import { Selector } from '@ngrx/store';

export interface FormDefinition<T> {
    label: string;
    type: string;
    schema: string;
    bindings?: any;
    validatorParams: any;
    getEntity?(entity: any): any;
    parser(changes: Partial<T>, schema?: any);
    formatter(changes: Partial<T>, schema?: any);
    getValidators?(...args: any[]): { [key: string]: any };
    schemaPreprocessor?(schema: any): any;
}
