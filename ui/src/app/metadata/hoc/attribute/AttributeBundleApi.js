import React from 'react';
import useFetch from 'use-http';
import API_BASE_PATH from '../../../App.constant';

import { DeleteConfirmation } from '../../../core/components/DeleteConfirmation';
import { createNotificationAction, NotificationContext } from '../../../notifications/hoc/Notifications';

export function AttributeBundleApi({ id, children }) {

    const { dispatch } = React.useContext(NotificationContext);

    const { get, put, post, del, response, loading } = useFetch(`${API_BASE_PATH}/custom/entity/bundles`, {
        cachePolicy: 'no-cache'
    });

    async function load(cb) {
        const b = await get(``);
        if (response.ok) {
            cb && cb(b);
        }
    }

    async function find(id, cb) {
        const b = await get(`/${id }`);
        if (response.ok) {
            cb && cb(b);
        }
    }

    async function update(id, body, cb) {
        const b = await put(`/${id}`, body);
        if (response.ok) {
            dispatch(createNotificationAction(
                `Bundle has been updated.`
            ));
            cb && cb(b);
        }
    }

    async function create(body, cb) {
        const b = await post(``, body);
        if (response.ok) {
            dispatch(createNotificationAction(
                `Bundle has been created.`
            ));
            cb && cb(b);
        }
    }

    async function remove(id, cb = () => { }) {
        await del(`/${id}`);
        if (response.ok) {
            dispatch(createNotificationAction(
                `Bundle has been deleted.`
            ));
            cb();
        }
    }

    return (
        <DeleteConfirmation title={`message.delete-attribute-title`} body={`message.delete-attribute-body`}>
            {(block) =>
                <div>{children(load, find, create, update, (id) => block(() => remove(id)), loading)}</div>
            }
        </DeleteConfirmation>
    );
}