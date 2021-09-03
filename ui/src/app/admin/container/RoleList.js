import React from 'react';
import { faEdit, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import { Translate } from '../../i18n/components/translate';

import { DeleteConfirmation } from '../../core/components/DeleteConfirmation';

export function RoleList({ roles, onDelete }) {

    const remove = (id) => {
        onDelete(id);
    }

    return (
        <DeleteConfirmation title={`message.delete-role-title`} body={`message.delete-role-body`}>
            {(block) =>
                <div className="container-fluid p-3">
                    <section className="section">
                        <div className="section-body border border-top-0 border-primary">
                            <div className="section-header bg-primary p-2 text-light">
                                <span className="lead">
                                    <Translate value="label.roles-management">Roles Management</Translate>
                                </span>
                            </div>
                            <div className="p-3">
                                <div className="d-flex justify-content-end w-100">
                                    <Link to="./new" className="btn btn-sm btn-success">
                                        <FontAwesomeIcon icon={faPlusCircle} /> &nbsp;
                                        <Translate value="action.add-new-role">Add new role</Translate>
                                    </Link>
                                </div>
                                <div className="table-responsive mt-3">
                                    <table className="table table-striped w-100 table-hover">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <Translate value="label.role-name">Role Name</Translate>
                                                </th>
                                                <th><span className="sr-only"><Translate value="label.actions">Actions</Translate></span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(roles?.length > 0) ? roles.map((role, i) =>
                                                <tr key={i}>
                                                    <td className="align-middle">{role.name}</td>
                                                    <td className="text-right">
                                                        <React.Fragment>
                                                            <Link disabled={role.name === 'ROLE_ADMIN'} to={`../roles/${role.resourceId}/edit`} className={`btn btn-link text-primary ${role.name === 'ROLE_ADMIN' ? 'disabled' : ''}`}>
                                                                <FontAwesomeIcon icon={faEdit} size="lg" />
                                                                <span className="sr-only">
                                                                    <Translate value="action.edit">Edit</Translate>
                                                                </span>
                                                            </Link>
                                                            <Button disabled={role.name === 'ROLE_ADMIN'} variant="link" className="text-danger" onClick={() => block(() => remove(role.resourceId))}>
                                                                <FontAwesomeIcon icon={faTrash} size="lg" />
                                                                <span className="sr-only">
                                                                    <Translate value="action.delete">Delete</Translate>
                                                                </span>
                                                            </Button>
                                                        </React.Fragment>
                                                    </td>
                                                </tr>
                                            ) : <tr>
                                                <td colSpan="3">No roles defined.</td>
                                            </tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            }
        </DeleteConfirmation>
    );
}