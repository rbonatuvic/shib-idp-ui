import React from 'react';
import useFetch from 'use-http';
import UserManagement from '../../admin/container/UserManagement';
import UserMaintenance from '../../admin/component/UserMaintenance';
import API_BASE_PATH from '../../App.constant';

import Translate from '../../i18n/components/translate';

export function AdminTab () {

    const [users, setUsers] = React.useState([]);

    const { get, response } = useFetch(`${API_BASE_PATH}/admin/users`, {
        cachePolicy: 'no-cache'
    }, []);

    async function loadUsers() {
        const users = await get('')
        if (response.ok) {
            setUsers(users);
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => {
        loadUsers();
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
                    <UserManagement users={users} reload={loadUsers}>
                        {(u, roles, onChangeUserRole, onDeleteUser) =>
                            <UserMaintenance users={ u } roles={roles} onChangeUserRole={onChangeUserRole} onDeleteUser={onDeleteUser} />}
                    </UserManagement>
                </div>
            </div>
        </section>
    );
}

export default AdminTab;