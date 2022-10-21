import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import { useDynamicRegistrationApi, useSelectedDynamicRegistration } from '../hoc/DynamicRegistrationContext';
import Translate from '../../i18n/components/translate';
import FormattedDate from '../../core/components/FormattedDate';
import Button from 'react-bootstrap/esm/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faHistory, faToggleOff, faToggleOn, faTrash } from '@fortawesome/free-solid-svg-icons';
import Badge from 'react-bootstrap/esm/Badge';

export function DynamicRegistrationDetail () {

    const { id } = useParams();
    const history = useHistory();

    const { select, enable, remove } = useDynamicRegistrationApi();

    const reselect = React.useCallback(() => select(id), [id, select]);
    const detail = useSelectedDynamicRegistration();
    
    const redirectOnDelete = () => history.push('/dashboard');

    const edit = (section) => {
        history.push(`/dynamic-registration/${id}/edit`);
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => { reselect() }, [id]);

    return (
        <div className="container-fluid p-3">
            <section className="section" tabIndex="0">
                <div className="section-body px-4 pb-4 border border-info">
                    {detail &&
                    <React.Fragment>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-bar">
                                <li className="breadcrumb-item">
                                    <Link to="/dashboard"><Translate value="action.dashboard">Dashboard</Translate></Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link to="/dashboard/dynamic-registrations"><Translate value="action.dynamic-registrations">Dynamic Registrations</Translate></Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    <span className="">
                                        { detail.name}
                                    </span>
                                </li>
                            </ol>
                        </nav>
                        <h2 className="mb-4" id="header">
                            <Translate value={`label.dynamic-registration-configuration`}>Dynamic Registration</Translate>
                        </h2>
                        <div className="container">

                            <div className="card enabled-status">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <h5 className="card-title version-title flex-grow-1">
                                            <p className="mb-1">
                                                <Translate value="label.saved">Saved</Translate>:&nbsp;
                                                <span className="save-date mb-2">
                                                    <FormattedDate date={detail.modifiedDate} time={true} />
                                                </span>
                                            </p>
                                            <p className="mb-1">
                                                <Translate value="label.by">By</Translate>:&nbsp;
                                                <span className="author">{detail.createdBy }</span>
                                            </p>
                                        </h5>
                                        <div className="d-flex align-items-start btn-group">
                                            <Button variant={detail.enabled ? 'outline-secondary' : 'outline-secondary' } size="sm" className=""
                                                    onClick={() => enable(detail, !detail.enabled, reselect)}>
                                                        <span className=" me-1">
                                                            <Translate value={detail.enabled ? 'label.disable' : 'label.enable'} />
                                                        </span>
                                                <FontAwesomeIcon size="lg" icon={detail.enabled ? faToggleOn : faToggleOff} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant={ 'danger' }
                                                disabled={detail.enabled}
                                                onClick={() => remove(detail.resourceId, redirectOnDelete)}>
                                                <Translate value="action.delete" />
                                                <FontAwesomeIcon icon={faTrash} className="ms-2" />
                                            </Button>
                                        </div>
                                    </div>

                                    <p className="card-text">
                                        <Badge bg={ detail.enabled ? 'primary' : 'danger' }>
                                            <Translate value={`value.${detail.enabled ? 'enabled' : 'disabled'}`}>Enabled</Translate>
                                        </Badge>
                                    </p>

                                </div>
                            </div>

                             <div className="px-3 my-3 d-flex justify-content-between" id="navigation">
                                <div>
                                    <Link className="btn btn-link" to={`/dynamic-registration/${id}/history`}>
                                        <FontAwesomeIcon icon={ faHistory } />&nbsp;
                                        <Translate value="action.version-history">Version History</Translate>
                                    </Link>
                                </div>
                            </div>

                            <section className="mb-4 config-section-list-item">
                                <div className="config-group">
                                    <div className="numbered-header d-flex justify-content-start bg-light align-items-center">
                                        <h2 className="title h4 m-0 flex-grow-1">
                                           <span className="text ms-2">
                                                <Translate value={ `label.dynamic-registraction-configuration` } />
                                            </span>
                                        </h2>
                                        <div className="actions px-2">
                                            <Button variant="link" className="edit-link change-view" onClick={()=>edit()}>
                                                <FontAwesomeIcon icon={faEdit} />&nbsp;
                                                <Translate value="action.edit">Edit</Translate>
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <pre>{JSON.stringify(detail, null, 4)}</pre>
                                    </div>
                                </div>
                            </section>
                            
                        </div>
                    </React.Fragment>
                    }
                </div>
            </section>
        </div>
        
    )
}