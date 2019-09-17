import { Metadata } from '../../domain/domain.type';

export interface FilterComparison {
    modelId: string;
    modelType: string;
    models: Metadata[];
}
