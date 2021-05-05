import { FilterActionTypes, CancelCreateFilter, SelectId } from './filter.action';

describe('Filter Actions', () => {
    it('should provide actions', () => {
        expect(new CancelCreateFilter('id').type).toBe(FilterActionTypes.CANCEL_CREATE_FILTER);
        expect(new SelectId('foo').type).toBe(FilterActionTypes.SELECT_ID);
    });
});
