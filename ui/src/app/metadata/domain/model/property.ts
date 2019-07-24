export interface Property {
    title?: string;
    type: string;
    name: string;
    value: any[];
    items: Property;
    properties: Property[];
    widget?: {
        id: string;
        data?: {key: string, label: string}[];
        dataUrl?: string;
        [propertyName: string]: any;
    };
}
