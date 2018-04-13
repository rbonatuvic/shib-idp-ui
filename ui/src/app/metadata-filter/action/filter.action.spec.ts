import * as actions from './filter.action';

describe('Filter Actions', () => {
    it('should provide actions', () => {
        expect(new actions.CancelCreateFilter().type).toBe(actions.CANCEL_CREATE_FILTER);
        expect(new actions.SelectId('foo').type).toBe(actions.SELECT_ID);
    });
});
