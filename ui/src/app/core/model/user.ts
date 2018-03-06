export interface User {
    id: string;
    role: string;
    name: {
        first: string,
        last: string
    };
}
