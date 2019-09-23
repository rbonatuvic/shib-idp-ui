import { Metadata } from '../../domain/domain.type';
import { FilterVersion } from './version';

export interface FilterComparison {
    modelId: string;
    modelType: string;
    models: FilterVersion[];
}
