import React from 'react';

export function AttributeBundleSelector({ id, find, children }) {
    const [bundle, setBundle] = React.useState();

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => {
        find(id, (item) => setBundle(item));
    }, []);

    return (
        <React.Fragment>{children(bundle)}</React.Fragment>
    );
}