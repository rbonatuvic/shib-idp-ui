import React from 'react';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Popover from 'react-bootstrap/Popover';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';



import FormattedDate from '../../../../core/components/FormattedDate';
import Translate from '../../../../i18n/components/translate';
import { Scroller } from '../../../../dashboard/component/Scroller';
import { DeleteSourceConfirmation } from './DeleteSourceConfirmation';



export default function SourceList({ entities, onDelete, onEnable }) {
    return (
        <DeleteSourceConfirmation>
            {(onDeleteSource) =>
            <Scroller entities={entities}>
            {(limited) =>
                <div className="table-responsive mt-3 source-list">
                    
                    <table className="table table-striped w-100 table-hover">
                        <thead>
                            <tr>
                                <th><Translate value="label.title">Title</Translate></th>
                                <th className="w-40"><Translate value="label.entity-id">Entity ID</Translate></th>
                                <th className="w-15"><Translate value="label.author">Author</Translate></th>
                                <th className="w-15"><Translate value="label.creation-date">Created Date</Translate></th>
                                <th className="text-center w-15"><Translate value="label.enabled">Enabled</Translate></th>
                                <th className="w-auto"></th>
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
                                    <td className="text-center">
                                        {onEnable ?
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => onEnable(source)}
                                                aria-label="Enable this service provider">
                                                <Translate value={ source.enabled ? 'label.disable' : 'label.enable' }>Disable</Translate>
                                                {!source.enabled && <>&nbsp;<FontAwesomeIcon icon={faCheck} size="lg" /></> }
                                            </button>
                                            :
                                            <Badge variant={source.serviceEnabled ? 'success' : 'danger'}>
                                                <Translate value={source.serviceEnabled ? 'value.enabled' : 'value.disabled'}></Translate>
                                            </Badge>
                                        }
                                    </td>
                                    <td className="text-right" id={`delete-source-btn-${idx}`}>
                                        <button className="btn btn-outline btn-sm btn-danger"
                                            type="button"
                                            disabled={source.serviceEnabled}
                                            onClick={() => onDeleteSource(source.id, onDelete)}>
                                            <span className="sr-only">Delete</span>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                        {source.serviceEnabled &&
                                            <Popover trigger="hover" placement="left" target={`delete-source-btn-${idx}`}>
                                                <Popover.Content>A metadata source must be disabled before it can be deleted.</Popover.Content>
                                            </Popover>
                                        }
                                    </td>
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
