import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';

import Translate from '../../i18n/components/translate';
import { useCurrentUser } from '../../core/user/UserContext';

import { GroupsProvider } from '../hoc/GroupsProvider';

export default function UserMaintenance({ users, roles, onDeleteUser, onChangeUserRole, onChangeUserGroup }) {

    const currentUser = useCurrentUser();

    return (
        <div className="table-responsive mt-3 provider-list">
            <table className="table table-striped w-100 table-hover">
                <thead>
                    <tr>
                        <th scope="col"><Translate value="label.user-id">UserId</Translate></th>
                        <th scope="col" ><Translate value="label.name">Name</Translate></th>
                        <th scope="col"><Translate value="label.email">Email</Translate></th>
                        <th scope="col" ><Translate value="label.role">Role</Translate></th>
                        <th scope="col" ><Translate value="label.group">Group</Translate></th>
                        <th scope="col"><Translate value="label.delete">Delete?</Translate></th>
                    </tr>
                </thead>
                <tbody>
                    <GroupsProvider>
                        {(groups, onRemove, loadingGroups) =>
                            <React.Fragment>
                                {users.map((user, idx) =>
                                    <tr key={idx}>
                                        <th>{user.username}</th>
                                        <td>{user.firstName} {user.lastName}</td>
                                        <td>{user.emailAddress}</td>
                                        <td>
                                            <label htmlFor={`role-${user.username}`} className="sr-only"><Translate value="action.user-role">User role</Translate></label>
                                            <select
                                                id={`role-${user.username}`}
                                                name={`role-${user.username}`}
                                                className="form-control"
                                                onChange={(event) => onChangeUserRole(user, event.target.value)}
                                                value={user.role}
                                                disabled={currentUser.username === user.username}
                                                disablevalidation="true">
                                                {roles.map((role, ridx) => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <label htmlFor={`group-${user.username}`} className="sr-only"><Translate value="action.user-role">User role</Translate></label>
                                            <select
                                                id={`group-${user.username}`}
                                                name={`group-${user.username}`}
                                                className="form-control"
                                                onChange={(event) => onChangeUserGroup(user, event.target.value)}
                                                value={user.group ? user.group : ''}
                                                disabled={loadingGroups || currentUser.username === user.username}
                                                disablevalidation="true">
                                                <option>Select Group</option>
                                                {groups.map((g, ridx) => (
                                                    <option key={ridx} value={g.resourceId}>{g.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            {currentUser.username !== user.username &&
                                                <Button className="text-danger" variant="link" onClick={() => onDeleteUser(user.username)}>
                                                    <span className="sr-only">
                                                        <Translate value="label.delete-user">Delete User</Translate>
                                                    </span>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </Button>
                                            }
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        }
                    </GroupsProvider>
                </tbody>
            </table>
        </div>
    );
}
