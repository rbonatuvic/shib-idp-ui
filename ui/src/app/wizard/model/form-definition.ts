export interface FormDefinition<T> {
    label: string;
    type: string;
    schema?: string;
    translate: {
        parser(changes: Partial<T>, schema?: any),
        formatter(changes: Partial<T>, schema?: any)
    };
    getValidators?(...args: any[]): { [key: string]: any };
}
