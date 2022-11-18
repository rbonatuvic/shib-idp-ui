import React from 'react';
import useFetch from 'use-http';

export function Schema({ path, children }) {

    const [schema, setSchema] = React.useState({});


    const { get, response, loading } = useFetch(path, {
        cachePolicy: 'no-cache'
    });

    async function loadSchema() {
        const list = await get(``);
        if (response.ok) {
            setSchema(list);
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => { loadSchema() }, []);

    return (<>{children(schema, loading)}</>);
}