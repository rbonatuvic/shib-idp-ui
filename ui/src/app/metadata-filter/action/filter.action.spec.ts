import * as actions from './filter.action';

describe('Filter Actions', () => {
    it('should provide actions', () => {
        expect(new actions.CancelCreateFilter().type).toBe(actions.CANCEL_CREATE_FILTER);
        expect(new actions.CancelViewMore().type).toBe(actions.CANCEL_VIEW_MORE);
        expect(new actions.QueryEntityIds({term: 'foo'}).type).toBe(actions.QUERY_ENTITY_IDS);
        expect(new actions.LoadEntityIdsSuccess([]).type).toBe(actions.LOAD_ENTITY_IDS_SUCCESS);
        expect(new actions.LoadEntityIdsError(new Error('Foobar!')).type).toBe(actions.LOAD_ENTITY_IDS_ERROR);
        expect(new actions.ViewMoreIds('foo').type).toBe(actions.VIEW_MORE_IDS);
        expect(new actions.SelectId('foo').type).toBe(actions.SELECT_ID);
    });
});
