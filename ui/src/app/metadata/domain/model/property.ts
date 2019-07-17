export interface Property {
    title?: string;
    type: string;
    name: string;
    value: string[];
    items: Property;
    properties: Property[];
    widget?: {
        id: string;
        [propertyName: string]: any;
    };
}
