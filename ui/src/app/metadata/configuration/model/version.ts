export interface MetadataVersion {
    id: string;
    date: string;
    creator: string;
}

export interface FilterVersion {
    resourceId: string;
    name: string;
    type: string;
    comparable: boolean;
}
