import React from 'react';
import useFetch from 'use-http';
import UserManagement from '../../admin/container/UserManagement';
import API_BASE_PATH from '../../App.constant';

import Translate from '../../i18n/components/translate';

export function AdminTab () {

    const [users, setUsers] = React.useState([]);

    const { get, patch, del, response } = useFetch(`${API_BASE_PATH}`, {})

    async function loadUsers() {
        const users = await get('/admin/users')
        if (response.ok) {
            setUsers(users);
        }
    }
    const [roles, setRoles] = React.useState([]);

    async function loadRoles() {
        const roles = await get('/supportedRoles')
        if (response.ok) {
            setRoles(roles);
        }
    }

    async function setUserRole (user, role) {
        const update = await patch(`/admin/users/${user.username}`, {
            ...user,
            role
        });
        if (response.ok) {
            loadUsers();
        }
    }

    async function deleteUser(id) {
        const removal = await del(`/admin/users/${id}`);
        if (response.ok) {
            loadUsers();
        }
    }

    React.useEffect(() => {
        loadUsers();
        loadRoles();
    }, []);

    
    return (
        <section className="section">
            <div className="section-body border border-top-0 border-primary">
                <div className="section-header bg-primary p-2 text-light">
                    <div className="row justify-content-between">
                        <div className="col-12">
                            <span className="lead"><Translate value="label.user-maintenance">User Maintenance</Translate></span>
                        </div>
                    </div>
                </div>
                <div className="p-3">
                    <UserManagement users={users} roles={roles} onDelete={deleteUser} onSetRole={setUserRole} />
                </div>
            </div>
        </section>
    );
}

export default AdminTab;