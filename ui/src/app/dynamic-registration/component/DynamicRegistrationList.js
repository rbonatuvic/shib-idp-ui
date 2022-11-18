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

import FormattedDate from '../../core/components/FormattedDate';
import Translate from '../../i18n/components/translate';
import { Scroller } from '../../dashboard/component/Scroller';
import { useTranslator } from '../../i18n/hooks';
import { useCanEnable, useIsAdmin } from '../../core/user/UserContext';
import { GroupsProvider } from '../../admin/hoc/GroupsProvider';

export function DynamicRegistrationList ({entities, children, onChangeGroup, onDelete, onApprove, onEnable}) {

    const translator = useTranslator();
    const isAdmin = useIsAdmin();
    const canEnable = useCanEnable();

    return (
        <React.Fragment>
            <Scroller entities={entities}>
            {(limited) =>
                <div className="table-responsive mt-3 source-list">
                    <table className="table table-striped w-100 table-hover">
                        <thead>
                            <tr>
                                <th><Translate value="label.title">Title</Translate></th>
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
                                    {limited.map((reg, idx) =>
                                    <tr key={idx}>
                                        <td className="align-middle">
                                            <Link to={`/dynamic-registration/${reg.resourceId}`}>{reg.name}</Link>
                                        </td>
                                        <td className="align-middle">
                                            {reg.idOfOwner}
                                        </td>
                                        <td className="align-middle"><FormattedDate date={reg.createdDate} /></td>
                                        <td className="text-center align-middle">
                                            <span className="d-flex justify-content-center align-items-center">
                                                {onApprove ?
                                                <Button variant={reg.approved ? 'outline-success' : 'outline-primary' }
                                                    id={`approve-switch-${reg.id}`}
                                                    size="sm" className=""
                                                        onClick={() => onApprove(reg.resourceId, !reg.approved)}>
                                                            <span className=" me-1">
                                                                <Translate value={reg.approved ? 'label.disapprove' : 'label.approve'} />
                                                            </span>
                                                    <FontAwesomeIcon size="lg" icon={reg.approved ? faSquareCheck : faSquare} />
                                                </Button>
                                                :
                                                <Badge bg={reg.approved ? 'success' : 'danger'}>
                                                    <Translate value={reg.approved ? 'value.approved' : 'value.disapproved'}></Translate>
                                                </Badge>
                                                }
                                            </span>
                                        </td>
                                        <td className="text-center align-middle">
                                            <span className="d-flex justify-content-center align-items-center">
                                            {onEnable && canEnable(reg.approved) ?
                                                <Form.Check
                                                    type="switch"
                                                    id={`enable-switch-${idx}`}
                                                    size="lg"
                                                    aria-label={translator(reg.enabled ? 'label.disable' : 'label.enable')}
                                                    onChange={({ target: { checked } }) => onEnable(reg.resourceId, checked)}
                                                    checked={reg.enabled}
                                                >
                                                </Form.Check>
                                                :
                                                <Badge bg={reg.enabled ? 'success' : 'danger'}>
                                                    <Translate value={reg.enabled ? 'value.enabled' : 'value.disabled'}></Translate>
                                                </Badge>
                                            }
                                            </span>
                                        </td>
                                        {isAdmin && onChangeGroup &&
                                        <td className="align-middle">
                                            <label htmlFor={`group-${reg.serviceProviderName}`} className="sr-only"><Translate value="action.source-group">Group</Translate></label>
                                            <Form.Select
                                                id={`group-${reg.id}`}
                                                name={`group-${reg.id}`}
                                                className="form-control"
                                                onChange={(event) => onChangeGroup(reg, event.target.value)}
                                                value={reg.idOfOwner ? reg.idOfOwner : ''}
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
                                            <OverlayTrigger trigger={reg.enabled ? ['hover', 'focus'] : []} placement="left"
                                                overlay={
                                                    <Popover id={`delete-source-btn-${idx}`}>
                                                        <Popover.Body>A metadata source must be disabled before it can be deleted.</Popover.Body>
                                                    </Popover>
                                                }>
                                                <span className="d-inline-block">
                                                    <Button variant="danger" size="sm"
                                                        type="button"
                                                        disabled={reg.enabled}
                                                        onClick={() => onDelete(reg.resourceId, onDelete)}>
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
                            <p className="text-center mb-0">No Dynamic Registrations found.</p>
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