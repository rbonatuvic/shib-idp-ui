export interface MetadataEntity {
    name: string;
    enabled: boolean;
    kind: string;

    getId(): string;

    serialize(): any;
}
