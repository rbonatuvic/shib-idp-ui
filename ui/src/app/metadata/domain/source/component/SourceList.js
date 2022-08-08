import React from 'react';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import FormattedDate from '../../../../core/components/FormattedDate';
import Translate from '../../../../i18n/components/translate';
import { Scroller } from '../../../../dashboard/component/Scroller';
import { useTranslator } from '../../../../i18n/hooks';
import { useCanEnable, useIsAdmin } from '../../../../core/user/UserContext';
import { GroupsProvider } from '../../../../admin/hoc/GroupsProvider';

export default function SourceList({ entities, onDelete, onEnable, onChangeGroup, children }) {

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
                                <th className="w-25"><Translate value="label.title">Title</Translate></th>
                                <th className="w-25"><Translate value="label.entity-id">Entity ID</Translate></th>
                                <th className=""><Translate value="label.author">Author</Translate></th>
                                <th className=""><Translate value="label.creation-date">Created Date</Translate></th>
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
                                                {source.createdBy}
                                            </td>
                                            <td className="align-middle"><FormattedDate date={source.createdDate} /></td>
                                            <td className="text-center align-middle">
                                                <span className="d-flex justify-content-center align-items-center">
                                                {onEnable && canEnable ?
                                                    <Form.Check
                                                        type="switch"
                                                        id={`enable-switch-${source.id}`}
                                                        size="lg"
                                                        aria-label={translator(source.serviceEnabled ? 'label.disable' : 'label.enable')}
                                                        onChange={({ target: { checked } }) => onEnable(source, checked)}
                                                        checked={source.serviceEnabled}
                                                    >
                                                    </Form.Check>
                                                    :
                                                    <Badge variant={source.serviceEnabled ? 'success' : 'danger'}>
                                                        <Translate value={source.serviceEnabled ? 'value.enabled' : 'value.disabled'}></Translate>
                                                    </Badge>
                                                }
                                                </span>
                                            </td>
                                            {isAdmin && onChangeGroup &&
                                                <td className="align-middle">
                                                    <label htmlFor={`group-${source.serviceProviderName}`} className="sr-only"><Translate value="action.source-group">Group</Translate></label>
                                                    <Form.Select
                                                        id={`group-${source.id}`}
                                                        name={`group-${source.id}`}
                                                        className="form-control"
                                                        onChange={(event) => onChangeGroup(source, event.target.value)}
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
                </div>
            }
            </Scroller>
            {children}
        </React.Fragment>
        
    );
}
