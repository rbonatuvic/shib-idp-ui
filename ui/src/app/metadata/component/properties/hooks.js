export function usePropertyWidth(columns) {
    return `${Math.floor(100 / (columns + 1))}%`
}