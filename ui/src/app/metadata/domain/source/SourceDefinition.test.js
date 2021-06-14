import { SourceBase } from './SourceDefinition';

describe('SourceDefinition', () => {
    describe('parser', () => {
        it('should remove null values', () => {
            expect(SourceBase.parser({
                foo: null,
                bar: 'baz',
                baz: {
                    bar: null
                }
            })).toEqual({bar: 'baz'});
        });
    })
});