import { Admin } from './admin';

export class AdminEntity implements Admin {

    username: string;
    firstName: string;
    lastName: string;
    emailAddress: string;

    role: string;

    constructor(
        properties: Admin
    ) {
        Object.assign(this, properties);
    }
}
