export interface MetadataEntity {
    name: string;
    enabled: boolean;
    kind: string;

    getId(): string;
    isDraft(): boolean;

    serialize(): any;
}
