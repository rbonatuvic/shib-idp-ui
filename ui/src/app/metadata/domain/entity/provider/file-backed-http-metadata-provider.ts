import {
    MetadataProvider
} from '../../model';

export class FileBackedHttpMetadataProvider implements MetadataProvider {
    id: string;
    name: string;
    '@type': string;

    createdDate?: string;
    modifiedDate?: string;
    version: string;

    constructor(descriptor?: Partial<MetadataProvider>) {
        Object.assign(this, descriptor);
    }

    getCreationDate(): Date {
        return new Date(this.createdDate);
    }
}
