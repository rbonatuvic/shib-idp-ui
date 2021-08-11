import React from 'react';
import { faEdit, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import { Translate } from '../../i18n/components/translate';

import { DeleteConfirmation } from '../../core/components/DeleteConfirmation';

export function GroupsList({ groups, onDelete }) {

    const remove = (id) => {
        onDelete(id);
    }

    return (
        <DeleteConfirmation title={`message.delete-group-title`} body={`message.delete-group-body`}>
            {(block) =>
                <div className="container-fluid p-3">
                    <section className="section">
                        <div className="section-body border border-top-0 border-primary">
                            <div className="section-header bg-primary p-2 text-light">
                                <span className="lead">
                                    <Translate value="label.groups-management">Groups Management</Translate>
                                </span>
                            </div>
                            <div className="p-3">
                                <div className="d-flex justify-content-end w-100">
                                    <Link to="./new" className="btn btn-sm btn-success">
                                        <FontAwesomeIcon icon={faPlusCircle} /> &nbsp;
                                        <Translate value="action.add-new-group">Add new group</Translate>
                                    </Link>
                                </div>
                                <div className="table-responsive mt-3">
                                    <table className="table table-striped w-100 table-hover">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <Translate value="label.group-name">Group Name</Translate>
                                                </th>
                                                <th>
                                                    <Translate value="label.group-description">Group Description</Translate>
                                                </th>
                                                <th><span className="sr-only"><Translate value="label.actions">Actions</Translate></span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {( groups?.length > 0 ) ? groups.map((group, i) =>
                                                <tr key={i}>
                                                    <td>{group.name}</td>
                                                    <td>{group.description || ''}</td>
                                                    <td className="text-right">
                                                        <Link to={`../groups/${group.resourceId}/edit`} className="btn btn-link text-primary">
                                                            <FontAwesomeIcon icon={faEdit} size="lg" />
                                                            <span className="sr-only">
                                                                <Translate value="action.edit">Edit</Translate>
                                                            </span>
                                                        </Link>
                                                        <Button variant="link" className="text-danger" onClick={() => block(() => remove(group.resourceId))}>
                                                            <FontAwesomeIcon icon={faTrash} size="lg" />
                                                            <span className="sr-only">
                                                                <Translate value="action.delete">Delete</Translate>
                                                            </span>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ) : <tr>
                                                <td colSpan="3">No groups defined.</td>
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