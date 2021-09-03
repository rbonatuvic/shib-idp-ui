import React from 'react';
import FormattedDate from '../../core/components/FormattedDate';
import { useIsAdmin } from '../../core/user/UserContext';

import Translate from '../../i18n/components/translate';
import { GroupsProvider } from '../../admin/hoc/GroupsProvider';
import { useMetadataEntity } from '../hooks/api';
import { createNotificationAction, NotificationTypes, useNotificationDispatcher } from '../../notifications/hoc/Notifications';
import { useTranslator } from '../../i18n/hooks';
import { useMetadataLoader } from '../hoc/MetadataSelector';

export function MetadataHeader ({ showGroup, model, current = true, enabled = true, children, ...props }) {

    const isAdmin = useIsAdmin();
    const translator = useTranslator();

    const { put, response } = useMetadataEntity('source', {
        cachePolicy: 'no-cache'
    });

    const notifier = useNotificationDispatcher();

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
                                <div className="form-inline">
                                    <label className="mr-2" htmlFor={`group-${model.serviceProviderName}`}><Translate value="action.source-group">Group</Translate>: </label>
                                    <select
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
                                    </select>

                                </div>
                            }
                        </GroupsProvider>
                        }
                    </h5>
                    {children}
                </div>

                <p className="card-text">
                    <span className={`badge badge-${enabled ? 'primary' : 'danger' }`}>
                        <Translate value={`value.${enabled ? 'enabled' : 'disabled'}`}>Enabled</Translate>
                    </span>
                    &nbsp;
                    <span className={`badge badge-${current ? 'primary' : 'warning'}`}>
                        <Translate value={`value.${current ? 'current' : 'not-current'}`}>Current</Translate>
                    </span>
                </p>

            </div>
        </div>
    );
}
