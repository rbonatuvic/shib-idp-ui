import { User } from '../../../core/model/user';

export interface Admin {
    createdDate?: string;
    updatedDate?: string;
    username: string;
    firstName: string;
    lastName: string;

    roles: Role[];

    role: Role;

    emailAddress: string;
}

export interface Role {
    name: string;
}
