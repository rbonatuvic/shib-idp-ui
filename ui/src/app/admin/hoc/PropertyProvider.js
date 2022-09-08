import React from 'react';
import { useProperty } from '../hooks';

export function PropertyProvider({ id, children }) {

    const [property, setProperty] = React.useState();
    const { get, response } = useProperty(id);

    async function loadProperty() {
        const r = await get(``);
        if (response.ok) {
            setProperty(r);
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => { loadProperty() }, []);

    return (<>{children(property)}</>);
}