import { Metadata } from './domain.type';

/*
 *   Utility functions
*/

export const combineAllFn = (d, p) => [...p, ...d];
export const doesExistFn = (ids, selected) => ids.indexOf(selected) > -1;
export const getInCollectionFn = (entities, selectedId) => {
    return selectedId && entities[selectedId];
};
export const getEntityIdsFn = list => list.map(entity => entity.entityId);

export const mergeOrderFn = (entities: Metadata[], order: string[]): Metadata[] => {
    return [...entities.sort(
        (a: Metadata, b: Metadata) => {
            const aIndex = order.indexOf(a.id);
            const bIndex = order.indexOf(b.id);
            return aIndex > bIndex ? 1 : bIndex > aIndex ? -1 : 0;
        }
    )];
};
