export interface MetadataEntity {
    name: string;
    enabled: boolean;
    kind: string;

    serialize(): any;
}
