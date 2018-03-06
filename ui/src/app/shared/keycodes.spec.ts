import * as Keycodes from './keycodes';

function range (start, edge, step = 1) {
    const ret = [];
    edge = edge || 0;
    step = step || 1;
    for (ret; (edge - start) * step > 0; start += step) {
        ret.push(start);
    }
    return ret;
}

describe('Keycodes utility', () => {
    describe('isPrintableKeyCode function', () => {
        it('should return true if keycode is between (not including) 47 and 58', () => {
            let rng = range(48, 57);
            rng.forEach((num) => {
                expect(Keycodes.isPrintableKeyCode(num)).toBe(true);
            });
        });

        it('should return true if keycode is between (not including) 64 and 91', () => {
            let rng = range(64 + 1, 91 - 1);
            rng.forEach((num) => {
                expect(Keycodes.isPrintableKeyCode(num)).toBe(true);
            });
        });

        it('should return true if keycode is between (not including) 95 and 112', () => {
            let rng = range(95 + 1, 112 - 1);
            rng.forEach((num) => {
                expect(Keycodes.isPrintableKeyCode(num)).toBe(true);
            });
        });

        it('should return true if keycode is between (not including) 185 and 193', () => {
            let rng = range(185 + 1, 193 - 1);
            rng.forEach((num) => {
                expect(Keycodes.isPrintableKeyCode(num)).toBe(true);
            });
        });

        it('should return true if keycode is between (not including) 218 and 223', () => {
            let rng = range(218 + 1, 223 - 1);
            rng.forEach((num) => {
                expect(Keycodes.isPrintableKeyCode(num)).toBe(true);
            });
        });

        it('should return true if keycode is 32 or 8', () => {
            expect(Keycodes.isPrintableKeyCode(32)).toBe(true);
            expect(Keycodes.isPrintableKeyCode(8)).toBe(true);
        });
    });
});
