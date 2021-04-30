import React from 'react';
import useFetch from 'use-http';
import first from 'lodash/first';
import last from 'lodash/last';
import API_BASE_PATH from '../../App.constant';
import { array_move } from '../../core/utility/array_move';

export const getId = (entity) => {
    return entity.resourceId ? entity.resourceId : entity.id;
};

export const mergeOrderFn = (entities, order) => {
    if (!entities) {
        return [];
    }
    const ordered = [...entities.sort(
        (a, b) => {
            const aIndex = order.indexOf(getId(a));
            const bIndex = order.indexOf(getId(b));
            return aIndex > bIndex ? 1 : bIndex > aIndex ? -1 : 0;
        }
    )];
    return ordered;
};

export function Ordered({ path = '/MetadataResolversPositionOrder', entities, children, prop = null}) {

    const orderEntities = (orderById, list) => {
        setOrdered(mergeOrderFn(list, orderById));
    };

    const { get, post, response } = useFetch(`${API_BASE_PATH}`, {
        cachePolicy: 'no-cache'
    });

    const [order, setOrder] = React.useState([]);
    const [ordered, setOrdered] = React.useState([]);

    const [firstId, setFirstId] = React.useState(null);
    const [lastId, setLastId] = React.useState(null);

    async function changeOrder(resourceIds) {
        await post(path, prop ? {
            [prop]: resourceIds
        } : [
            ...resourceIds
        ]);
        if (response.ok) {
            loadOrder();
        }
    }

    const onOrderUp = (id) => {
        const index = order.indexOf(id);
        const newOrder = array_move(order, index, index - 1);
        changeOrder(newOrder);
    };

    const onOrderDown = (id) => {
        const index = order.indexOf(id);
        const newOrder = array_move(order, index, index + 1);
        changeOrder(newOrder);
    };

    async function loadOrder () {
        const o = await get(path);
        if (response.ok) {
            const ids = prop ? o.hasOwnProperty(prop) ? o[prop] : o : o;
            setOrder(ids);
            setFirstId(first(ids));
            setLastId(last(ids));
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => loadOrder(),[]);

    React.useEffect(() => orderEntities(order, entities), [order, entities]);

    return (
        <>
            {children(ordered, firstId, lastId, onOrderUp, onOrderDown)}
        </>
    );
}