import React from 'react';

export function AttributeBundleList({ load, children }) {

    const [bundles, setBundles] = React.useState([]);

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => {
        reload();
    }, []);

    const reload = () => {
        load((list) => setBundles(list));
    };

    return (
        <React.Fragment>{children(bundles, reload)}</React.Fragment>
    );
}