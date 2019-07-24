import { Section } from './section';
import { Metadata } from '../../domain/domain.type';

export interface MetadataConfiguration {
    sections: Section[];
    dates: String[];
}
