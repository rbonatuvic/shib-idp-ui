import React from 'react';
import { AccessRequest } from '../../admin/component/AccessRequest';
import UserManagement from '../../admin/container/UserManagement';

export function UserActions({ users }) {
    return (
        <UserManagement users={users}>
            {(u, roles, onChangeUserRole, onChangeGroup, onDeleteUser) =>
                <AccessRequest users={u} roles={roles} onChangeUserRole={onChangeUserRole} onDeleteUser={onDeleteUser} />}
        </UserManagement>
    );
}

export default UserActions;