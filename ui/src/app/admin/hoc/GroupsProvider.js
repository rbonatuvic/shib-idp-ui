import React from 'react';
import { useGroups } from '../hooks';

export function GroupsProvider({ children }) {

    const [groups, setGroups] = React.useState([]);


    const { get, del, response } = useGroups({
        cachePolicy: 'no-cache'
    });

    async function loadGroups() {
        const list = await get(``);
        if (response.ok) {
            setGroups(list);
        }
    }

    async function removeGroup(id) {
        await del(`/${id}`);
        if (response.ok) {
            loadGroups();
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => { loadGroups() }, []);

    return (<>{children(groups, removeGroup)}</>);
}