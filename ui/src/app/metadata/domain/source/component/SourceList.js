import React from 'react';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';

import FormattedDate from '../../../../core/components/FormattedDate';
import Translate from '../../../../i18n/components/translate';
import { Scroller } from '../../../../dashboard/component/Scroller';
import { useTranslator } from '../../../../i18n/hooks';
import { useCanEnable, useIsAdmin } from '../../../../core/user/UserContext';
import { GroupsProvider } from '../../../../admin/hoc/GroupsProvider';

export default function SourceList({ entities, onDelete, onEnable, onApprove, onChangeGroup, children }) {

    const translator = useTranslator();
    const isAdmin = useIsAdmin();
    const canEnable = useCanEnable();

    return (
        <React.Fragment>
            <Scroller entities={entities || []}>
            {(limited) =>
                <div className="table-responsive mt-3 source-list">
                    <table className="table table-striped w-100 table-hover">
                        <thead>
                            <tr>
                                <th className=""><Translate value="label.title">Title</Translate></th>
                                <th className=""><Translate value="label.entity-id">Entity ID</Translate></th>
                                <th className=""><Translate value="label.source-protocol">Protocol</Translate></th>
                                <th className=""><Translate value="label.author">Author</Translate></th>
                                <th className=""><Translate value="label.creation-date">Created Date</Translate></th>
                                <th className="text-center"><Translate value="label.approval">Approval</Translate></th>
                                <th className="text-center"><Translate value="label.enabled">Enabled</Translate></th>
                                {isAdmin && onChangeGroup && <th className=""><Translate value="label.group">Group</Translate></th> }
                                {onDelete && isAdmin &&
                                <th className="w-auto">
                                    <span className="sr-only"><Translate value="action.actions">Actions</Translate></span>
                                </th>
                                }
                            </tr>
                        </thead>
                        <tbody>
                            <GroupsProvider>
                                {(groups, removeGroup, loadingGroups) =>
                                    <React.Fragment>
                                        {limited.map((source, idx) =>
                                        <tr key={idx}>
                                            <td className="align-middle">
                                                <Link to={`/metadata/source/${source.id}/configuration/options`}>{source.serviceProviderName}</Link>
                                            </td>
                                            <td className="align-middle">
                                                {source.entityId}
                                            </td>
                                            <td className="align-middle">
                                                {source.protocol}
                                            </td>
                                            <td className="align-middle">
                                                {source.createdBy}
                                            </td>
                                            <td className="align-middle"><FormattedDate date={source.createdDate} /></td>
                                            <td className="text-center align-middle">
                                                <span className="d-flex justify-content-center align-items-center">
                                                    {onApprove ?
                                                    <Button variant={source.approved ? 'outline-success' : 'outline-primary' }
                                                        id={`approve-switch-${idx}`}
                                                        size="sm" className=""
                                                            onClick={() => onApprove(source, !source.approved)}>
                                                                <span className=" me-1">
                                                                    <Translate value={source.approved ? 'label.disapprove' : 'label.approve'} />
                                                                </span>
                                                        <FontAwesomeIcon size="lg" icon={source.approved ? faSquareCheck : faSquare} />
                                                    </Button>
                                                    :
                                                    <Badge bg={source.approved ? 'success' : 'danger'}>
                                                        <Translate value={source.approved ? 'value.approved' : 'value.disapproved'}></Translate>
                                                    </Badge>
                                                    }
                                                </span>
                                            </td>
                                            <td className="text-center align-middle">
                                                <span className="d-flex justify-content-center align-items-center">
                                                {onEnable && canEnable(source.approved) ?
                                                    <Form.Check
                                                        type="switch"
                                                        id={`enable-switch-${idx}`}
                                                        size="lg"
                                                        aria-label={translator(source.serviceEnabled ? 'label.disable' : 'label.enable')}
                                                        onChange={({ target: { checked } }) => onEnable(source, checked)}
                                                        checked={source.serviceEnabled}
                                                    >
                                                    </Form.Check>
                                                    :
                                                    <Badge bg={source.serviceEnabled ? 'success' : 'danger'}>
                                                        <Translate value={source.serviceEnabled ? 'value.enabled' : 'value.disabled'}></Translate>
                                                    </Badge>
                                                }
                                                </span>
                                            </td>
                                            
                                            
                                            {isAdmin && onChangeGroup &&
                                                <td className="align-middle">
                                                    <label htmlFor={`group-${source.serviceProviderName}`} className="sr-only"><Translate value="action.source-group">Group</Translate></label>
                                                    <Form.Select
                                                        id={`group-${idx}`}
                                                        name={`group-${idx}`}
                                                        className="form-control"
                                                        onChange={(event) => onChangeGroup({source, group: event.target.value})}
                                                        value={source.idOfOwner ? source.idOfOwner : ''}
                                                        disabled={loadingGroups}
                                                        disablevalidation="true">
                                                        <option>Select Group</option>
                                                        {groups.map((g, ridx) => (
                                                            <option key={ridx} value={g.resourceId}>{g.name}</option>
                                                        ))}
                                                    </Form.Select>
                                                </td>
                                            }
                                            {onDelete && isAdmin &&
                                                <td className="text-end align-middle">
                                                    <OverlayTrigger trigger={source.serviceEnabled ? ['hover', 'focus'] : []} placement="left"
                                                        overlay={
                                                            <Popover id={`delete-source-btn-${idx}`}>
                                                                <Popover.Body>A metadata source must be disabled before it can be deleted.</Popover.Body>
                                                            </Popover>
                                                        }>
                                                        <span className="d-inline-block">
                                                            <Button variant="danger" size="sm"
                                                                type="button"
                                                                id={`delete-${idx}`}
                                                                disabled={source.serviceEnabled}
                                                                onClick={() => onDelete(source.id, onDelete)}>
                                                                <span className="sr-only">Delete</span>
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </Button>
                                                        </span>
                                                    </OverlayTrigger>
                                                </td>
                                                }
                                        </tr>
                                        )}
                                    </React.Fragment>
                                }
                            </GroupsProvider>
                        </tbody>
                    </table>
                    { !limited?.length && !children && 
                        <div className="d-flex justify-content-center">
                            <div className="w-25 alert alert-info m-3 d-flex flex-column align-items-center" id="zero-state-alert">
                                <p className="text-center mb-0">No Metadata Sources found.</p>
                            </div>
                        </div>
                    }
                </div>
            }
            </Scroller>
            {children}
        </React.Fragment>
        
    );
}
