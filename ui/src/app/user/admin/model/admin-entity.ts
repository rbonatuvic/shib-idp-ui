import { Admin, Role } from './admin';

export class AdminEntity implements Admin {

    username: string;
    firstName: string;
    lastName: string;
    emailAddress: string;

    roles: Role[];

    constructor(
        properties: Admin
    ) {
        Object.assign(this, properties);
    }

    get role(): Role {
        return this.roles[0];
    }

    set role(newRole: Role) {
        this.roles[0] = newRole;
    }
}
