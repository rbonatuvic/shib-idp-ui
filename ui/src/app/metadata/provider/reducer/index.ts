import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';
import * as fromEditor from './editor.reducer';
import * as fromEntity from './entity.reducer';
import * as fromCollection from './collection.reducer';
import * as utils from '../../domain/domain.util';

import * as fromWizard from '../../../wizard/reducer';

import { MetadataProvider } from '../../domain/model';
import { WizardStep } from '../../../wizard/model';
import { ProviderOrder } from '../../domain/model/metadata-order';

export interface ProviderState {
    editor: fromEditor.EditorState;
    entity: fromEntity.EntityState;
    collection: fromCollection.CollectionState;
}

export const reducers = {
    editor: fromEditor.reducer,
    entity: fromEntity.reducer,
    collection: fromCollection.reducer
};

export interface State extends fromRoot.State {
    provider: ProviderState;
}

export const getProviderState = createFeatureSelector<ProviderState>('provider');

export const getEditorStateFn = (state: ProviderState) => state.editor;
export const getEntityStateFn = (state: ProviderState) => state.entity;
export const getCollectionStateFn = (state: ProviderState) => state.collection;

export const getEditorState = createSelector(getProviderState, getEditorStateFn);
export const getEntityState = createSelector(getProviderState, getEntityStateFn);
export const getCollectionState = createSelector(getProviderState, getCollectionStateFn);

/*
Editor State
*/

export function getSchemaParseFn(schema, locked): any {
    if (!schema) {
        return null;
    }
    return {
        ...schema,
        properties: Object.keys(schema.properties).reduce((prev, current) => {
            return {
                ...prev,
                [current]: {
                    ...schema.properties[current],
                    readOnly: locked,
                    ...(schema.properties[current].hasOwnProperty('properties') ?
                        getSchemaParseFn(schema.properties[current], locked) :
                        {}
                    )
                }
            };
        }, {})
    };
}

export const getSchemaLockedFn = (step, locked) => step ? step.locked ? locked : false : false;
export const getLockedStatus = createSelector(getEditorState, fromEditor.getLocked);
export const getLocked = createSelector(fromWizard.getCurrent, getLockedStatus, getSchemaLockedFn);

export const getSchemaObject = createSelector(getEditorState, fromEditor.getSchema);
export const getSchema = createSelector(getSchemaObject, getLocked, getSchemaParseFn);

export const getEditorIsValid = createSelector(getEditorState, fromEditor.isEditorValid);

export const getFormStatus = createSelector(getEditorState, fromEditor.getFormStatus);
export const getInvalidEditorForms = createSelector(getEditorState, fromEditor.getInvalidForms);


/*
Entity State
*/

export const getEntityIsSaved = createSelector(getEntityState, fromEntity.isEntitySaved);
export const getEntityChanges = createSelector(getEntityState, fromEntity.getEntityChanges);
export const getEntityIsSaving = createSelector(getEntityState, fromEntity.isEditorSaving);
export const getUpdatedEntity = createSelector(getEntityState, fromEntity.getUpdatedEntity);

/*
 *   Select pieces of Provider Collection
*/
export const getProviderOrder = createSelector(getCollectionState, fromCollection.getProviderOrder);
export const getAllProviders = createSelector(getCollectionState, fromCollection.selectAllProviders);
export const getProviderEntities = createSelector(getCollectionState, fromCollection.selectProviderEntities);
export const getSelectedProviderId = createSelector(getCollectionState, fromCollection.getSelectedProviderId);
export const getSelectedProvider = createSelector(getProviderEntities, getSelectedProviderId, utils.getInCollectionFn);
export const getProviderIds = createSelector(getCollectionState, fromCollection.selectProviderIds);
export const getProviderCollectionIsLoaded = createSelector(getCollectionState, fromCollection.getIsLoaded);

export const getProviderNames = createSelector(getAllProviders, (providers: MetadataProvider[]) => providers.map(p => p.name));

export const getProviderFilters = createSelector(getSelectedProvider, provider => provider.metadataFilters);

export const getProviderXmlIds = createSelector(getAllProviders, (providers: MetadataProvider[]) => providers.map(p => p.xmlId));

export const mergeProviderOrderFn = (providers: MetadataProvider[], order: ProviderOrder): MetadataProvider[] => {
    return [...providers.sort(
        (a: MetadataProvider, b: MetadataProvider) => {
            const aIndex = order.resourceIds.indexOf(a.resourceId);
            const bIndex = order.resourceIds.indexOf(b.resourceId);
            return aIndex > bIndex ? 1 : bIndex > aIndex ? -1 : 0;
        }
    )];
};
export const getOrderedProviders = createSelector(getAllProviders, getProviderOrder, mergeProviderOrderFn);
