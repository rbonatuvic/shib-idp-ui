import React from 'react';
import { AccessRequest } from '../../admin/component/AccessRequest';
import UserManagement from '../../admin/container/UserManagement';

export function UserActions({ users, reloadUsers }) {
    return (
        <UserManagement users={users} reload={reloadUsers}>
            {(u, roles, onChangeUserRole, onDeleteUser) =>
                <AccessRequest users={u} roles={roles} onChangeUserRole={onChangeUserRole} onDeleteUser={onDeleteUser} />}
        </UserManagement>
    );
}

export default UserActions;