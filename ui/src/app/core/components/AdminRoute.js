import React from 'react';
import { Redirect, Route } from 'react-router';

import { useIsAdmin } from '../user/UserContext';

export function AdminRoute({ children, ...rest }) {
    const isAdmin = useIsAdmin();
    return (
        <Route
            {...rest}
            render={({ location }) =>
                isAdmin ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/dashboard",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}