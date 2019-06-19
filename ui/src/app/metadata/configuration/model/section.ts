import { Property } from '../../domain/model/property';

export interface Section {
    id: string;
    index: number;
    label: string;
    pageNumber: number;
    properties: Property[];
}

export default Section;
