import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Admin } from '../model/admin';
import { AdminCollectionActionsUnion, AdminCollectionActionTypes } from '../action/admin-collection.action';

export interface CollectionState extends EntityState<Admin> {
    selectedAdminId: string | null;
    saving: boolean;
}

export const adapter: EntityAdapter<Admin> = createEntityAdapter<Admin>({
    selectId: (model: Admin) => model.username
});

export const initialState: CollectionState = adapter.getInitialState({
    selectedAdminId: null,
    saving: false
});

export function reducer(state = initialState, action: AdminCollectionActionsUnion): CollectionState {
    switch (action.type) {
        case AdminCollectionActionTypes.LOAD_ADMIN_SUCCESS: {
            let s = adapter.addAll(action.payload, {
                ...state,
                selectedAdminId: state.selectedAdminId
            });
            return s;
        }
        case AdminCollectionActionTypes.UPDATE_ADMIN_SUCCESS: {
            return adapter.updateOne(action.payload, {
                ...state,
                saving: false
            });
        }
        case AdminCollectionActionTypes.REMOVE_ADMIN_SUCCESS: {
            return adapter.removeOne(action.payload, {
                ...state,
                saving: false
            });
        }

        default: {
            return state;
        }
    }
}

export const getSelectedAdminId = (state: CollectionState) => state.selectedAdminId;
export const getIsSaving = (state: CollectionState) => state.saving;
export const {
    selectIds: selectAdminIds,
    selectEntities: selectAdminEntities,
    selectAll: selectAllAdmins,
    selectTotal: selectAdminTotal
} = adapter.getSelectors();
