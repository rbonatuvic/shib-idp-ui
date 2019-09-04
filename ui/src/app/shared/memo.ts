export function memoize(func) {
    const cache = {};
    return function (...args: any[]) {
        const key = JSON.stringify(args);
        if (cache[key]) {
            return cache[key];
        } else {
            const val = func.apply(null, args);
            cache[key] = val;
            return val;
        }
    };
}

export default { memoize };
