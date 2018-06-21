/*
 *   Utility functions
*/

export const combineAllFn = (d, p) => [...p, ...d];
export const doesExistFn = (ids, selected) => ids.indexOf(selected) > -1;
export const getInCollectionFn = (entities, selectedId) => {
    return selectedId && entities[selectedId];
};
export const getEntityIdsFn = list => list.map(entity => entity.entityId);
