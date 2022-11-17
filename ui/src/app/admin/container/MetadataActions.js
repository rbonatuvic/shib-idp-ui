import React, { useCallback } from 'react';
import { DeleteConfirmation } from '../../core/components/DeleteConfirmation';
import { useMetadataActivator, useMetadataApprover, useMetadataEntity } from '../../metadata/hooks/api';

import { createNotificationAction, NotificationTypes } from '../../store/notifications/NotificationSlice';
import { useApproveSourceMutation, useDeleteSourceMutation, useEnableSourceMutation } from '../../store/metadata/SourceSlice';
import { useDispatch } from 'react-redux';

export function MetadataActions ({type, children}) {

    const dispatch = useDispatch();

    const { del, response } = useMetadataEntity(type, {
        cachePolicy: 'no-cache'
    });

    const activator = useMetadataActivator(type);

    async function enableEntity(entity, enabled, cb = () => {}) {
        await activator.patch(`/${entity.resourceId}/${enabled ? 'enable' : 'disable'}`);
        if (activator?.response.ok) {
            toastEnableSuccess(type, enabled);
            cb();
        } else {
            const { errorCode, errorMessage, cause } = activator?.response?.data;
            toastError(errorCode, errorMessage, cause);
        }
    }

    async function deleteEntity(id, cb = () => {}) {
        await del(`/${id}`);
        if (response.ok) {
            toastDeleteSuccess(type);
            cb();
        } else {
            const { errorCode, errorMessage, cause } = activator?.response?.data;
            toastError(errorCode, errorMessage, cause);
        }
    }

    const approver = useMetadataApprover('source');

    async function approveEntity(entity, enabled, cb = () => {}) {
        await approver.patch(`${entity.resourceId}/${enabled ? 'approve' : 'unapprove'}`);
        if (approver?.response.ok) {
            toastApproveSuccess(type, enabled);
            cb();
        } else {
            const { errorCode, errorMessage, cause } = approver?.response?.data;
            toastError(errorCode, errorMessage, cause);
        }
    }

    const toast = useCallback((message, type) => dispatch(createNotificationAction(message, type)), [dispatch]);

    const toastApproveSuccess = (type, enabled) => toast(`Metadata ${type} has been ${enabled ? 'approved' : 'unapproved'}.`);
    const toastEnableSuccess = (type, enabled) => toast(`Metadata ${type} has been ${enabled ? 'enabled' : 'disabled'}.`);
    const toastDeleteSuccess = (type) => toast(`Metadata ${type} has been deleted.`);
    const toastError = (code, message, cause) => toast(`${code}: ${message} ${cause ? `-${cause}` : ''}`, NotificationTypes.ERROR);

    const [approveSource] = useApproveSourceMutation();
    const [enableSource] = useEnableSourceMutation();
    const [deleteSource] = useDeleteSourceMutation();

    const remove = type === 'source' ? 
        (id, cb) => {
            deleteSource({id}).then(() => cb());
        } :
        deleteEntity;
    const enable = type === 'source' ?
        ({id}, enabled) => enableSource({id, enabled}) :
        enableEntity;
    const approve = type === 'source' ?
        ({id}, approved) => approveSource({id, approved}) :
        approveEntity;


    return (
        <DeleteConfirmation title={`message.delete-${type}-title`} body={`message.delete-${type}-body`}>
            {(block) =>
                <>{children({
                    enable,
                    remove: (id, cb) => block(() => remove(id, cb)),
                    approve
                })}</>
            }
        </DeleteConfirmation>
    );
}