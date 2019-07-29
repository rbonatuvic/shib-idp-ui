import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { HistoryActionTypes, HistoryActionsUnion } from '../action/history.action';
import { MetadataVersion } from '../model/version';

export interface HistoryState extends EntityState<MetadataVersion> {
    selectedVersionId: string;
}

export function sortByDate(a: MetadataVersion, b: MetadataVersion): number {
    return a.date.localeCompare(b.date);
}

export const adapter: EntityAdapter<MetadataVersion> = createEntityAdapter<MetadataVersion>({
    sortComparer: sortByDate,
    selectId: (model: MetadataVersion) => model.id
});

export const initialState: HistoryState = adapter.getInitialState({
    selectedVersionId: null
});

export function reducer(state = initialState, action: HistoryActionsUnion): HistoryState {
    switch (action.type) {
        case HistoryActionTypes.SET_HISTORY:
            return adapter.addAll(action.payload.versions, {
                ...state,
                selectedVersionId: state.selectedVersionId
            });
        case HistoryActionTypes.SELECT_VERSION:
            return {
                ...state,
                selectedVersionId: action.payload
            };
        case HistoryActionTypes.CLEAR_HISTORY:
            return adapter.removeAll({
                ...initialState
            });
        default: {
            return state;
        }
    }
}

export const getSelectedVersionId = (state: HistoryState) => state.selectedVersionId;
export const {
    selectIds: selectVersionIds,
    selectEntities: selectVersionEntities,
    selectAll: selectAllVersions,
    selectTotal: selectVersionTotal
} = adapter.getSelectors();