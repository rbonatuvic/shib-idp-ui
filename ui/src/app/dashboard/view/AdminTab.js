import React from 'react';
import UserManagement from '../../admin/container/UserManagement';
import UserMaintenance from '../../admin/component/UserMaintenance';

import Translate from '../../i18n/components/translate';
import Spinner from '../../core/components/Spinner';
import { useGetUsersQuery } from '../../store/user/UserSlice';

export function AdminTab () {

    const { data: users = [], isLoading } = useGetUsersQuery();

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
                    <UserManagement users={users}>
                        {(u, roles, onChangeUserRole, onChangeUserGroup, onDeleteUser, loading) =>
                            <UserMaintenance users={ u }
                                roles={roles}
                                loading={loading}
                                onChangeUserRole={onChangeUserRole}
                                onDeleteUser={onDeleteUser}
                                onChangeUserGroup={onChangeUserGroup} />}
                        
                    </UserManagement>
                    {isLoading && <div className="d-flex justify-content-center text-primary"><Spinner size="4x" /></div> }
                </div>
            </div>
        </section>
    );
}

export default AdminTab;