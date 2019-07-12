export interface Property {
    title?: string;
    type: string;
    name: string;
    value: any[];
    items: Property;
    properties: Property[];
    widget?: {
        id: string;
        [propertyName: string]: any;
    };
}
