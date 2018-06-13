export interface MetadataEntity {
    name: string;
    enabled: boolean;
    type: string;

    serialize(): any;
}
