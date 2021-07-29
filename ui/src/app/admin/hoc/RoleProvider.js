import React from 'react';
import { useRole } from '../hooks';

export function RoleProvider({ id, children }) {

    const [role, setRole] = React.useState({id: 'foo'});
    const { get, response } = useRole(id);

    async function loadRole() {
        const role = await get(``);
        if (response.ok) {
            setRole(role);
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => { loadRole() }, []);

    return (<>{children(role)}</>);
}