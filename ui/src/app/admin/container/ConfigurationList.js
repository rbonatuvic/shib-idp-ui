import React from 'react';
import { faDownload, faEdit, faPlusCircle, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Link } from 'react-router-dom';

import { Translate } from '../../i18n/components/translate';

import { DeleteConfirmation } from '../../core/components/DeleteConfirmation';

export function ConfigurationList({ configurations, onDelete, loading }) {

    const remove = (id) => {
        onDelete(id);
    }

    return (
        <DeleteConfirmation title={`message.delete-property-title`} body={`message.delete-property-body`}>
            {(block) =>
                <div className="container-fluid p-3">
                    {loading ? 
                        <div className="d-flex justify-content-end flex-fill">
                            <FontAwesomeIcon icon={faSpinner} spin={true} pulse={true} size="lg" />
                        </div>
                    :
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
                                                        <Button onClick={() => console.log('clicked')} className={`btn btn-success`}>
                                                            <FontAwesomeIcon icon={faDownload} size="lg" />
                                                            &nbsp; <Translate value="action.download">Download single file</Translate>
                                                        </Button>
                                                        <ButtonGroup aria-label="Actions" className="ms-4" >
                                                            <Link className="btn btn-primary" to={`../configurations/${c.resourceId}/edit`}>
                                                                <FontAwesomeIcon icon={faEdit} size="lg" />
                                                                &nbsp; Edit
                                                            </Link>
                                                            <Button variant="danger"onClick={() => block(() => remove(c.resourceId))}>
                                                                <FontAwesomeIcon icon={faTrash} size="lg" />
                                                                &nbsp; <Translate value="action.delete">Delete</Translate>
                                                            </Button>
                                                        </ButtonGroup>
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
                    }
                </div>
            }
        </DeleteConfirmation>
    );
}