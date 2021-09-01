import React from 'react';
import { useParams } from 'react-router-dom';

export function AttributeBundleSelector({ id, find, children }) {
    const [bundle, setBundle] = React.useState([]);

    React.useEffect(() => {
        find(id, (item) => setBundle(item));
    }, []);

    return (
        <React.Fragment>{children(bundle)}</React.Fragment>
    );
}