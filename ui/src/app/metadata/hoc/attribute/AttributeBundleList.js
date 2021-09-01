import React from 'react';

export function AttributeBundleList({ load, children }) {

    const [bundles, setBundles] = React.useState([]);

    React.useEffect(() => {
        load((list) => setBundles(list));
    }, []);

    return (
        <React.Fragment>{children(bundles)}</React.Fragment>
    );
}