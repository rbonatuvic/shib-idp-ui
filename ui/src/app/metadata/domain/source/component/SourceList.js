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
import { useIsAdmin } from '../../../../core/user/UserContext';

export default function SourceList({ entities, onDelete, onEnable }) {

    const translator = useTranslator();
    const isAdmin = useIsAdmin();

    return (
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
                                {onDelete && <th className="w-auto"></th>}
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
                                        <span className="d-flex justify-content-center">
                                            {onEnable && isAdmin ?
                                                <Form.Check
                                                    type="switch"
                                                    id="custom-switch"
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
                                    {onDelete && <td className="text-right">
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
                                                    onClick={() => onDelete(source.id, onDelete)}>
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
    );
}
