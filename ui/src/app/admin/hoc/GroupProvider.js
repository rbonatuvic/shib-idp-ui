import React from 'react';
import { useGroup } from '../hooks';

export function GroupProvider({ id, children }) {

    const [group, setGroup] = React.useState();


    const { get, response } = useGroup({
        cachePolicy: 'no-cache'
    });

    async function loadGroup() {
        const group = await get(``);
        if (response.ok) {
            setGroup(group);
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => { loadGroup() }, []);

    return (<>{children(group)}</>);
}