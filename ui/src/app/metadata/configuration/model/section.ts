export interface Section {
    id: string;
    index: number;
    label: string;
    pageNumber: number;
    properties: SectionProperty[];
}

export interface SectionProperty {
    label: string;
    type: string;
    value: any[];
    widget?: {
        id: string;
        [propertyName: string]: any;
    };
}
