import React from 'react';
import { useMetadataFilters, useFilterActivator } from '../../../hooks/api';
import { DeleteConfirmation } from '../../../../core/components/DeleteConfirmation';
import { createNotificationAction } from '../../../../store/notifications/NotificationSlice';
import { useDispatch } from 'react-redux';

export const MetadataFiltersContext = React.createContext();

export function MetadataFilters ({ providerId, types = [], filters, children }) {

    const dispatch = useDispatch();

    const { put, del, get, response, loading } = useMetadataFilters(providerId, {
        cachePolicy: 'no-cache'
    });

    const { patch } = useFilterActivator(providerId, {
        cachePolicy: 'no-cache'
    });

    const [filterData, setFilterData] = React.useState([]);

    async function loadFilters(id) {
        const list = await get(``);
        if (response.ok) {
            setFilterData(list.filter(f => types.length > 1 ? types.indexOf(f['@type']) > -1 : true));
        }
    }

    async function updateFilter(filter) {
        await put(`/${filter.resourceId}`, filter);
        if (response.ok) {
            loadFilters(providerId);
            dispatch(createNotificationAction(
                `Metadata Filter has been updated.`
            ));
        }
    }

    async function enableFilter(filter, enabled) {
        await patch(`/${filter.resourceId}/${enabled ? 'enable' : 'disable'}`, {
            ...filter,
            filterEnabled: enabled
        });
        if (response.ok) {
            dispatch(createNotificationAction(
                `Metadata Filter has been ${enabled ? 'enabled' : 'disabled'}.`
            ));
            loadFilters(providerId);
        }
    }

    async function deleteFilter(filterId) {
        await del(`/${filterId}`);
        if (response.ok) {
            dispatch(createNotificationAction(
                `Metadata Filter has been deleted.`
            ));
            loadFilters();
        }
    }

    const onDelete = (id) => deleteFilter(id);
    const onUpdate = (f) => updateFilter(f);

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => {
        if (!filters) {
            loadFilters(providerId);
        } else {
            setFilterData(filterData);
        }
    }, [providerId]);


    return (
        <DeleteConfirmation title={`message.delete-filter-title`} body={`message.delete-filter-body`}>
            {(block) =>
                <MetadataFiltersContext.Provider value={filterData}>
                    {children(filterData, onUpdate, (id) => block(() => onDelete(id)), enableFilter, loading)}
                </MetadataFiltersContext.Provider>
            }
        </DeleteConfirmation>
    );
}
