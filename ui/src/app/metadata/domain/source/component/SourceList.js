import React from 'react';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';

import FormattedDate from '../../../../core/components/FormattedDate';
import Translate from '../../../../i18n/components/translate';
import { Scroller } from '../../../../dashboard/component/Scroller';
import { DeleteSourceConfirmation } from './DeleteSourceConfirmation';
import { useIsAdmin } from '../../../../core/user/UserContext';
import { GroupsProvider } from '../../../../admin/hoc/GroupsProvider';

export default function SourceList({ entities, onDelete, onEnable, onChangeGroup }) {

    const isAdmin = useIsAdmin();

    return (
        <DeleteSourceConfirmation>
            {(onDeleteSource) =>
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
                                <th className=""><Translate value="label.enabled">Enabled</Translate></th>
                                {isAdmin && onChangeGroup && <th className=""><Translate value="label.group">Group</Translate></th> }
                                {onDeleteSource && <th className="w-auto"></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {limited.map((source, idx) =>
                                <tr key={idx}>
                                    <td>
                                        <Link to={`/metadata/source/${source.id}/configuration/options`}>{source.serviceProviderName}</Link>
                                    </td>
                                    <td>
                                        {source.entityId}
                                    </td>
                                    <td>
                                        {source.createdBy}
                                    </td>
                                    <td><FormattedDate date={source.createdDate} /></td>
                                    <td className="">
                                        {onEnable ?
                                            <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => onEnable(source)}
                                                aria-label="Enable this service provider">
                                                <Translate value={ source.enabled ? 'label.disable' : 'label.enable' }>Disable</Translate>
                                                {!source.enabled && <>&nbsp;<FontAwesomeIcon icon={faCheck} size="lg" /></> }
                                            </Button>
                                            :
                                            <Badge variant={source.serviceEnabled ? 'success' : 'danger'}>
                                                <Translate value={source.serviceEnabled ? 'value.enabled' : 'value.disabled'}></Translate>
                                            </Badge>
                                        }
                                    </td>
                                    
                                    {isAdmin && onChangeGroup &&
                                        <td className="">
                                            <GroupsProvider>
                                                {(groups, removeGroup, loadingGroups) =>
                                                    <React.Fragment>
                                                        <label htmlFor={`group-${source.serviceProviderName}`} className="sr-only"><Translate value="action.source-group">Group</Translate></label>
                                                        <select
                                                            id={`group-${source.id}`}
                                                            name={`group-${source.id}`}
                                                            className="form-control"
                                                            onChange={(event) => onChangeGroup(source, event.target.value)}
                                                            value={source.groupId ? source.groupId : ''}
                                                            disabled={loadingGroups}
                                                            disablevalidation="true">
                                                            <option>Select Group</option>
                                                            {groups.map((g, ridx) => (
                                                                <option key={ridx} value={g.resourceId}>{g.name}</option>
                                                            ))}
                                                        </select>
                                                    </React.Fragment>
                                                }
                                            </GroupsProvider>
                                        </td>
                                    }
                                    {onDeleteSource &&
                                    <td className="text-right">
                                        <OverlayTrigger trigger={source.serviceEnabled ? ['hover', 'focus'] : []} placement="left"
                                            overlay={
                                                <Popover id={`delete-source-btn-${idx}`}>
                                                    <Popover.Content>A metadata source must be disabled before it can be deleted.</Popover.Content>
                                                </Popover>
                                            }>
                                                <span className="d-inline-block">
                                                    <Button variant="danger" size="sm"
                                                        type="button"
                                                        disabled={source.serviceEnabled}
                                                        onClick={() => onDeleteSource(source.id, onDelete)}>
                                                        <span className="sr-only">Delete</span>
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </Button>
                                                </span>
                                        </OverlayTrigger>
                                    </td>}
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            }
            </Scroller>
            }
        </DeleteSourceConfirmation>
    );
}
