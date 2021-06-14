export function isValidRegex(pattern) {
    if (!pattern) {
        return false;
    }
    try {
        new RegExp(pattern);
    } catch (err) {
        return false;
    }
    return true;
};
