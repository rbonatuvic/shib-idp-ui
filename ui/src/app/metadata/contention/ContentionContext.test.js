import { render, screen } from "@testing-library/react";
import { Contention, ContentionActions, filterKeys, getContention, openContentionModalAction, reducer, resolveContentionAction } from "./ContentionContext";

jest.mock('../../i18n/hooks', () => ({
    useTranslator: () => (value) => value,
    useTranslation: (value) => value
}));

describe('filterKeys', () => {
    it('should filter keys that arent displayed to user', () => {
        expect(filterKeys({
            version: 'foo',
            name: 'bar'
        })).toBe(true)
    })
});

describe('getContention', () => {
    it('should return an object describing conflicts', () => {
        const contention = getContention({ name: 'baz', version: 0 }, { name: 'foo', version: 1 }, { name: 'bar', version: 2 });
        expect(contention.theirChanges[0].conflict).toBe(true);
    });
});

describe('openContentionModalAction', () => {
    it('should create a reducer action', () => {
        const action = openContentionModalAction({}, {name: 'foo'}, {name: 'bar'}, jest.fn(), jest.fn());
        expect(action.type).toEqual(ContentionActions.OPEN_CONTENTION_MODAL);
    })
});

describe('resolveContentionAction', () => {
    it('should create a reducer action', () => {
        const action = resolveContentionAction();
        expect(action.type).toEqual(ContentionActions.END_CONTENTION);
    })
});

describe('reducer', () => {
    it('should set show to true', () => {
        const state = reducer({}, {type: ContentionActions.OPEN_CONTENTION_MODAL});
        expect(state.show).toBe(true);
    })

    it('should set show to false', () => {
        const state = reducer({}, { type: ContentionActions.END_CONTENTION });
        expect(state.show).toBe(false);
    })

    it('should not change state', () => {
        const init = {};
        const state = reducer(init, { type: 'foo' });
        expect(state).toBe(init);
    })
});

describe('context component', () => {

    it('should provide the contention context', async () => {
        render(<Contention>
            <div>test</div>
        </Contention>);

        expect(screen.getByText('test')).toBeInTheDocument();
    });

})