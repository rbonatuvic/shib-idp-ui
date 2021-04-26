import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import Translate from '../../i18n/components/translate';
import { useCurrentUser } from '../../core/user/UserContext';

export default function UserManagement({ users, roles, onDelete, onSetRole }) {

    const setUserRole = (user, role) => onSetRole(user, role);

    const currentUser = useCurrentUser();

    const [modal, setModal] = React.useState(false);

    const toggle = () => setModal(!modal);

    const [deleting, setDeleting] = React.useState(null);

    const deleteUser = (id) => {
        onDelete(deleting);
        setDeleting(null);
    }

    return (
        <div className="table-responsive mt-3 provider-list">
            <table className="table table-striped w-100 table-hover">
                <thead>
                    <tr>
                        <th scope="col"><Translate value="label.user-id">UserId</Translate></th>
                        <th scope="col" ><Translate value="label.name">Name</Translate></th>
                        <th scope="col"><Translate value="label.email">Email</Translate></th>
                        <th scope="col" ><Translate value="label.role">Role</Translate></th>
                        <th scope="col"><Translate value="label.delete">Delete?</Translate></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, idx) =>
                        <tr key={idx}>
                            <th>{ user.username }</th>
                            <td>{ user.firstName } { user.lastName }</td>
                            <td>{ user.emailAddress }</td>
                            <td>
                                <label htmlFor={`role-${user.username}`} className="sr-only"><Translate value="action.user-role">User role</Translate></label>
                                <select
                                    id={`role-${user.username}`}
                                    name={`role-${user.username}`}
                                    model="user.role"
                                    className="form-control"
                                    onChange={(event) => setUserRole(user, event.target.value) }
                                    disabled={currentUser.username === user.username}>
                                        { roles.map((role, ridx) => (
                                            <option key={role} value={role}>{ role }</option>
                                        ))}
                                    
                                </select>
                            </td>
                            <td>
                                {currentUser.username !== user.username &&
                                <button className="btn btn-link text-danger" onClick={() => setDeleting(user.username) }>
                                    <span className="sr-only">
                                    <Translate value="label.delete-user">Delete User</Translate>
                                    </span>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                                }
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Modal isOpen={!!deleting} toggle={() => setDeleting(null)}>
                <ModalHeader toggle={toggle}><Translate value="message.delete-user-title">Delete User?</Translate></ModalHeader>
                <ModalBody className="d-flex align-content-center">
                    <FontAwesomeIcon className="text-danger mr-4" size="4x" icon={faExclamationTriangle} />
                    <p className="text-danger font-weight-bold mb-0">
                        <Translate value="message.delete-user-body">You are requesting to delete a user. If you complete this process the user will be removed. This cannot be undone. Do you wish to continue?</Translate>
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={() => deleteUser(deleting)}>
                        <Translate value="action.delete">Delete</Translate>
                    </Button>{' '}
                    <Button color="secondary" onClick={() => setDeleting(null)}>
                        <Translate value="action.cancel">Cancel</Translate>
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

/*
<tr *ngFor="let user of users$ | async">
            <th>{{ user.username }}</th>
            <td>{{ user.firstName }} {{ user.lastName }}</td>
            <td>{{ user.emailAddress }}</td>
            <td>
                <label [for]="'role-' + user.username"
                    className="sr-only"><translate-i18n key="action.user-role">User role</translate-i18n></label>
                <select
                    [id]="'role-' + user.username"
                    [name]="'role-' + user.username"
                    [ngModel]="user.role"
                    className="form-control"
                    (change)="setUserRole(user, $event.target.value)"
                    [disabled]="currentUser.username === user.username">
                    <option *ngFor="let role of roles$ | async" [value]="role">{{ role }}</option>
                </select>
            </td>
            <td>
                <button className="btn btn-link" (click)="deleteUser(user.username)" *ngIf="!(currentUser.username === user.username)">
                    <span className="sr-only">
                        <translate-i18n key="label.delete-user">Delete User</translate-i18n>
                    </span>
                    <i className="fa fa-trash fa-lg text-danger"></i>
                </button>
            </td>
        </tr>*/