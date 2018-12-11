import { User } from '../../../core/model/user';

export interface Admin extends User {
    createdDate?: string;
    updatedDate?: string;
    resourceId: string;

    email: string;
}
