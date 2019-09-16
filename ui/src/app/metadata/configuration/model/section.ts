export interface Section {
    id: string;
    index: number;
    label: string;
    pageNumber: number;
    properties: SectionProperty[];
    differences?: boolean;
}

export interface SectionProperty {
    label: string;
    type: string;
    value: any[];
    differences?: boolean;
    properties?: SectionProperty[];
    widget?: {
        id: string;
        data?: any[];
        [propertyName: string]: any;
    };
}
