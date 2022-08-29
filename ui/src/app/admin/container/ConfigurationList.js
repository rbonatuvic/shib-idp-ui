import React from 'react';
import { faDownload, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import { Translate } from '../../i18n/components/translate';

import { DeleteConfirmation } from '../../core/components/DeleteConfirmation';

export function ConfigurationList({ configurations, onDelete }) {

    const remove = (id) => {
        onDelete(id);
    }

    return (
        <DeleteConfirmation title={`message.delete-property-title`} body={`message.delete-property-body`}>
            {(block) =>
                <div className="container-fluid p-3">
                    <section className="section">
                        <div className="section-body border border-top-0 border-primary">
                            <div className="section-header bg-primary p-2 text-light">
                                <span className="lead">
                                    <Translate value="label.configuration-management">Configuration Management</Translate>
                                </span>
                            </div>
                            <div className="p-3">
                                <div className="d-flex justify-content-end w-100">
                                    <Link to="./new" className="btn btn-sm btn-success">
                                        <FontAwesomeIcon icon={faPlusCircle} /> &nbsp;
                                        <Translate value="action.create-new-configuration">Create new configuration</Translate>
                                    </Link>
                                </div>
                                <div className="table-responsive mt-3">
                                    <table className="table table-striped w-100 table-hover">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <Translate value="label.configuration-name">Configuration Name (label)</Translate>
                                                </th>
                                                <th><span className="sr-only"><Translate value="label.actions">Actions</Translate></span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(configurations?.length > 0) ? configurations.map((c, i) =>
                                                <tr key={i}>
                                                    <td className="align-middle">
                                                        <Link to={`../configurations/${c.resourceId}/edit`}>
                                                            {c.name}
                                                        </Link>
                                                    </td>
                                                    <td className="text-end">
                                                        <React.Fragment>
                                                            <Button onClick={() => console.log('clicked')} className={`btn btn-primary`}>
                                                                <FontAwesomeIcon icon={faDownload} size="lg" />
                                                                &nbsp; <Translate value="action.download">Download</Translate>
                                                            </Button>
                                                            <Button variant="danger" className="ms-2" onClick={() => block(() => remove(c.resourceId))}>
                                                                <FontAwesomeIcon icon={faTrash} size="lg" />
                                                                &nbsp; <Translate value="action.delete">Delete</Translate>
                                                            </Button>
                                                        </React.Fragment>
                                                    </td>
                                                </tr>
                                            ) : <tr>
                                                <td colSpan="3">No configurations.</td>
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