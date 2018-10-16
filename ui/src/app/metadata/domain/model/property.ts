export interface Property {
    type: string;
    name: string;
    value: string[];
    items: Property;
    properties: Property[];
}
