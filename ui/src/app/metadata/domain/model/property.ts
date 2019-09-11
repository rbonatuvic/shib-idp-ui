export interface Property {
    title?: string;
    type: string;
    name: string;
    value: any[];
    items: Property;
    properties: Property[];
    differences?: boolean;
    widget?: {
        id: string;
        data?: {key: string, label: string}[];
        dataUrl?: string;
        [propertyName: string]: any;
    };
}
