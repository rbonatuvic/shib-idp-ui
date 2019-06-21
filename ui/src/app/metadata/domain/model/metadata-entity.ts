export interface MetadataEntity {
    name: string;
    enabled: boolean;
    kind: string;

    createdBy: string;

    getId(): string;
    getDisplayId(): string;
    isDraft(): boolean;
    getCreationDate(): Date;

    serialize(): any;
}
