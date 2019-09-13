import { memoize } from './memo';

const fns = {
    square(n) {
        return n * n;
    }
};

describe('memoize function', () => {
    it('should return a memoized function', () => {
        spyOn(fns, 'square').and.callThrough();
        const memoized = memoize(fns.square);
        const call1 = memoized(1);
        const call2 = memoized(2);
        const call3 = memoized(2);
        expect(call1).toBe(1);
        expect(call2).toBe(4);
        expect(call3).toBe(4);
        expect(fns.square).toHaveBeenCalledTimes(2);
    });
});
