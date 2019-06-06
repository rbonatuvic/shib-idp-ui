import { Metadata } from './domain.type';

/*
 *   Utility functions
*/

export const combineAllFn = (d, p) => [...p, ...d];
export const doesExistFn = (ids, selected) => ids.indexOf(selected) > -1;
export const getInCollectionFn = (entities, selectedId) => {
    console.log(entities, selectedId);
    return selectedId && entities[selectedId];
};
export const getEntityIdsFn = list => list.map(entity => entity.entityId);

export const getId = (entity: Metadata): string => {
    return entity.resourceId ? entity.resourceId : entity.id;
};

export const mergeOrderFn = (entities: Metadata[], order: string[]): Metadata[] => {
    const ordered = [...entities.sort(
        (a: Metadata, b: Metadata) => {
            const aIndex = order.indexOf(getId(a));
            const bIndex = order.indexOf(getId(b));
            return aIndex > bIndex ? 1 : bIndex > aIndex ? -1 : 0;
        }
    )];
    return ordered;
};
