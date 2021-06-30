import { BaseFilterDefinition } from "./BaseFilterDefinition";

describe('formatter', () => {
    it('should return the provided object with no changes', () => {
        expect(BaseFilterDefinition.formatter({})).toEqual({});
    })
});

describe('parser', () => {
    it('should return the provided object with no changes', () => {
        expect(BaseFilterDefinition.parser({})).toEqual({});
    })
});

describe('display', () => {
    it('should return the provided object with no changes', () => {
        expect(BaseFilterDefinition.display({})).toEqual({});
    })
});