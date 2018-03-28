import { AutoCompleteStateEmitter, AutoCompleteState, defaultState } from './autocomplete.model';

describe('AutoCompleteStateEmitter', () => {
    let emitter: AutoCompleteStateEmitter;

    describe('constructor', () => {
        it('should init with a default state', () => {
            emitter = new AutoCompleteStateEmitter();
            expect(emitter.currentState).toEqual(defaultState);
        });

        it('should init with a provided state', () => {
            const st: AutoCompleteState = {
                ...defaultState
            };
            emitter = new AutoCompleteStateEmitter(st);
            expect(emitter.currentState).toEqual(st);
        });
    });
});
