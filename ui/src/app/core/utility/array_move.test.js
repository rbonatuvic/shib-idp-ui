import {array_move} from './array_move';

it('shifts an item in an array by +1 index', () => {
    expect(array_move([1, 2], 0, 1)).toEqual([2, 1]);
});

it('shifts an item in an array by -1 index', () => {
    expect(array_move([1, 2], 1, 0)).toEqual([2, 1]);
});