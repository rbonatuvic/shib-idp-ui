import { Section } from './section';
import { FilterVersion } from './version';

export interface MetadataConfiguration {
    sections: Section[];
    dates: String[];
}

export interface FilterConfiguration {
    dates: ['2019-08-08T08:40:32.015', '2019-08-08T08:40:19.266'];
    filters: FilterVersion[];
}
