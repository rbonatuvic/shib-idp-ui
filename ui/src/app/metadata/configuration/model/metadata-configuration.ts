import { Section } from './section';
import { FilterVersion } from './version';

export interface MetadataConfiguration {
    sections: Section[];
    dates: String[];
}

export interface FilterConfiguration {
    dates: string[];
    filters: FilterVersion[];
}
