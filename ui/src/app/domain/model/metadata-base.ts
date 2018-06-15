export interface MetadataBase {
    id?: string;
    createdDate?: string;
    modifiedDate?: string;
    version: string;

    name: string;
    enabled: boolean;
    kind: string;

    serialize(): any;
}
