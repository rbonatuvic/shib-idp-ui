import React from 'react';
import { useRole } from '../hooks';

export function RoleProvider({ id, children }) {

    const [role, setRole] = React.useState();
    const { get, response } = useRole(id);

    async function loadRole() {
        const r = await get(``);
        if (response.ok) {
            setRole(r);
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => { loadRole() }, []);

    return (<>{children(role)}</>);
}