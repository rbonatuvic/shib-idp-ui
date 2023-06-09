import React from 'react';
import FormattedDate from '../../core/components/FormattedDate';
import { useIsAdmin } from '../../core/user/UserContext';

import Translate from '../../i18n/components/translate';
import { GroupsProvider } from '../../admin/hoc/GroupsProvider';
import { useMetadataEntity } from '../hooks/api';
import { createNotificationAction, NotificationTypes } from '../../store/notifications/NotificationSlice';
import { useTranslator } from '../../i18n/hooks';
import { useMetadataLoader } from '../hoc/MetadataSelector';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import { useDispatch } from 'react-redux';

export function MetadataHeader ({ showGroup, model, current = true, enabled = true, children, ...props }) {

    const isAdmin = useIsAdmin();
    const translator = useTranslator();

    const { put, response } = useMetadataEntity('source', {
        cachePolicy: 'no-cache'
    });

    const notifier = useDispatch();

    async function changeSourceGroup(s, group) {
        let toast;
        const resp = await put(`/${s.id}`, {
            ...s,
            idOfOwner: group
        });
        if (response.ok) {
            toast = createNotificationAction(`Updated group successfully.`, NotificationTypes.SUCCESS);
            reload();
        } else {
            toast = createNotificationAction(`${resp.errorCode} - ${translator(resp.errorMessage)}`, NotificationTypes.ERROR);
        }
        if (toast) {
            notifier(toast);
        }
    }

    const reload = useMetadataLoader();

    return (
        <div className="card enabled-status" {...props}>
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <h5 className="card-title version-title flex-grow-1">
                        <p className="mb-1">
                            <Translate value="label.saved">Saved</Translate>:&nbsp;
                            <span className="save-date mb-2">
                                <FormattedDate date={model.modifiedDate} time={true} />
                            </span>
                        </p>
                        <p className="mb-1">
                            <Translate value="label.by">By</Translate>:&nbsp;
                            <span className="author">{model.createdBy }</span>
                        </p>
                        {isAdmin && showGroup &&
                        <GroupsProvider>
                            {(groups, removeGroup, loadingGroups) =>
                                <div className="form-inline" style={{maxWidth: '50%'}}>
                                    <label className="me-2 mb-2" htmlFor={`group-${model.serviceProviderName}`}>
                                        <Translate value="action.source-group">Group</Translate>:
                                    </label>
                                    <Form.Select
                                        id={`group-${model.id}`}
                                        name={`group-${model.id}`}
                                        className="form-control form-control-sm"
                                        onChange={(event) => changeSourceGroup(model, event.target.value)}
                                        value={model.idOfOwner}
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
                    {children}
                </div>

                <p className="card-text">
                    <Badge bg={ enabled ? 'primary' : 'danger' }>
                        <Translate value={`value.${enabled ? 'enabled' : 'disabled'}`}>Enabled</Translate>
                    </Badge>
                    &nbsp;
                    <Badge bg={ enabled ? 'primary' : 'warning' }>
                        <Translate value={`value.${current ? 'current' : 'not-current'}`}>Current</Translate>
                    </Badge>
                </p>

            </div>
        </div>
    );
}
