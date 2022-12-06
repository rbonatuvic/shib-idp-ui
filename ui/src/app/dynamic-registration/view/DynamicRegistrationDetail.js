import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Translate from '../../i18n/components/translate';
import FormattedDate from '../../core/components/FormattedDate';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn, faTrash } from '@fortawesome/free-solid-svg-icons';
import Badge from 'react-bootstrap/Badge';
import { Configuration } from '../../metadata/hoc/Configuration';
import { MetadataConfiguration } from '../../metadata/component/MetadataConfiguration';

import { Schema } from '../../form/Schema';

import definition from '../hoc/DynamicConfigurationDefinition';
import { useSelectDynamicRegistrationQuery } from '../../store/dynamic-registration/DynamicRegistrationSlice';
import { DynamicRegistrationActions } from '../hoc/DynamicRegistrationActions';
import { useCanEnable, useIsAdmin } from '../../core/user/UserContext';
import { GroupsProvider } from '../../admin/hoc/GroupsProvider';

export function DynamicRegistrationDetail () {

    const { id } = useParams();
    const history = useHistory();

    const { data: detail } = useSelectDynamicRegistrationQuery({id});

    const edit = (section) => {
        history.push(`/dynamic-registration/${id}/edit`);
    };

    const isAdmin = useIsAdmin();
    const canEnable = useCanEnable()(detail?.approved);

    return (
        <div className="container-fluid p-3">
            <section className="section" tabIndex="0">
                <div className="section-body px-4 pb-4 border border-info">
                    {detail &&
                    <DynamicRegistrationActions>
                        {({enable, remove, changeGroup}) => (
                            <React.Fragment>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb breadcrumb-bar">
                                    <li className="breadcrumb-item">
                                        <Link to="/dashboard"><Translate value="action.dashboard">Dashboard</Translate></Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link to="/dashboard/dynamic-registration"><Translate value="action.dynamic-registrations">Dynamic Registrations</Translate></Link>
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
                                <div className="card enabled-status mb-4">
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
                                                    <span className="author">{detail.idOfOwner }</span>
                                                </p>
                                                {isAdmin &&
                                                    <GroupsProvider>
                                                        {(groups, removeGroup, loadingGroups) =>
                                                            <div className="form-inline" style={{maxWidth: '50%'}}>
                                                                <label className="me-2 mb-2" htmlFor={`group-${detail.name}`}>
                                                                    <Translate value="action.source-group">Group</Translate>:
                                                                </label>
                                                                <Form.Select
                                                                    id={`group-select-dr`}
                                                                    name={`group-${detail.id}`}
                                                                    className="form-control form-control-sm"
                                                                    onChange={({target: {value}}) => changeGroup({ registration: detail, group: value })}
                                                                    value={detail.idOfOwner}
                                                                    disabled={loadingGroups}
                                                                    disablevalidation="true">
                                                                    <option>Select Group</option>
                                                                    {groups.map((g, ridx) => (
                                                                        <option key={ridx} value={g.resourceId}>{g.name}</option>
                                                                    ))}
                                                                </Form.Select>
                                                            </div>
                                                        }
                                                    </GroupsProvider>
                                                }
                                            </h5>
                                            {!detail.enabled &&
                                            <div className="d-flex align-items-start btn-group">
                                                {enable && (canEnable && detail?.approved) &&
                                                    <Button variant={detail.enabled ? 'outline-secondary' : 'outline-secondary' }
                                                        size="sm"
                                                        className=""
                                                        onClick={() => enable({id: detail.resourceId, enabled: !detail.enabled})}>
                                                            <span className=" me-1">
                                                                <Translate value={detail.enabled ? 'label.disable' : 'label.enable'} />
                                                            </span>
                                                        <FontAwesomeIcon size="lg" icon={detail.enabled ? faToggleOn : faToggleOff} />
                                                    </Button>
                                                }
                                                {isAdmin &&
                                                    <Button
                                                        size="sm"
                                                        variant={ 'danger' }
                                                        disabled={detail.enabled}
                                                        onClick={() => remove({id: detail.resourceId})}>
                                                        <Translate value="action.delete" />
                                                        <FontAwesomeIcon icon={faTrash} className="ms-2" />
                                                    </Button>
                                                }
                                            </div>
                                            }
                                        </div>

                                        <p className="card-text">
                                            <Badge bg={ detail.enabled ? 'primary' : 'danger' }>
                                                <Translate value={`value.${detail.enabled ? 'enabled' : 'disabled'}`}>Enabled</Translate>
                                            </Badge>
                                        </p>

                                    </div>
                                </div>

                                <Schema path={definition.schema}>
                                        {(schema) => 
                                        <Configuration entities={[detail]} schema={schema} definition={definition}>
                                            {(config) =>
                                                <MetadataConfiguration configuration={config} onEdit={!detail.enabled ? () => edit() : null} />
                                            }
                                        </Configuration>
                                    }
                                </Schema>
                                
                            </div>
                        </React.Fragment>)}
                    </DynamicRegistrationActions>
                    }
                </div>
            </section>
        </div>
        
    )
}