import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import Translate from '../../i18n/components/translate';
import { useCurrentUser } from '../../core/user/UserContext';

import { GroupsProvider } from '../hoc/GroupsProvider';
import { useTranslator } from '../../i18n/hooks';

export default function UserMaintenance({ users, roles, loading, onDeleteUser, onChangeUserRole, onChangeUserGroup }) {

    const currentUser = useCurrentUser();
    const translator = useTranslator();

    return (
        <div className="table-responsive mt-3 provider-list">
            <table className="table table-striped w-100 table-hover">
                <thead>
                    <tr>
                        <th scope="col"><Translate value="label.user-id">UserId</Translate></th>
                        <th scope="col"><Translate value="label.name">Name</Translate></th>
                        <th scope="col"><Translate value="label.email">Email</Translate></th>
                        <th scope="col"><Translate value="label.role">Role</Translate></th>
                        <th scope="col"><Translate value="label.group">Group</Translate></th>
                        <th scope="col"><Translate value="label.delete">Delete?</Translate></th>
                    </tr>
                </thead>
                <tbody>
                    <GroupsProvider>
                        {(groups, onRemove, loadingGroups) =>
                            <React.Fragment>
                                {users.map((user, idx) =>
                                    <tr key={idx}>
                                        <td className="align-middle">{user.username}</td>
                                        <td className="align-middle">{user.firstName} {user.lastName}</td>
                                        <td className="align-middle">{user.emailAddress}</td>
                                        <td className="align-middle">
                                            <label htmlFor={`role-${user.username}`} className="sr-only"><Translate value="action.user-role">User role</Translate></label>
                                            <Form.Select
                                                id={`role-${user.username}`}
                                                name={`role-${user.username}`}
                                                className="form-control"
                                                onChange={(event) => onChangeUserRole(user, event.target.value)}
                                                value={user.role}
                                                disabled={loading || currentUser.username === user.username}
                                                disablevalidation="true">
                                                {roles.map((role, ridx) => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </Form.Select>
                                        </td>
                                        <td className="align-middle">
                                            <OverlayTrigger
                                                trigger={user.role === 'ROLE_ADMIN' ? ['hover', 'focus'] : []}
                                                overlay={
                                                <Tooltip>{translator(`message.user-role-admin-group`)}</Tooltip>
                                            }>
                                                <span className="d-block">
                                                    <label htmlFor={`group-${user.username}`} className="sr-only"><Translate value="action.user-group">User group</Translate></label>
                                                    <Form.Select
                                                        id={`group-${user.username}`}
                                                        name={`group-${user.username}`}
                                                        className="form-control"
                                                        onChange={(event) => onChangeUserGroup(user, event.target.value)}
                                                        value={user.groupId ? user.groupId : ''}
                                                        disabled={loading || loadingGroups || currentUser.username === user.username || user.role === 'ROLE_ADMIN'}
                                                        disablevalidation="true">
                                                        <option>Select Group</option>
                                                        {groups.map((g, ridx) => (
                                                            <option key={ridx} value={g.resourceId}>{g.name}</option>
                                                        ))}
                                                    </Form.Select>
                                                </span>
                                            </OverlayTrigger>
                                            
                                        </td>
                                        <td className="align-middle">
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
