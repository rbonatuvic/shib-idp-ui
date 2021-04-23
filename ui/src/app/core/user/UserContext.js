import React from "react";
import useFetch from 'use-http';
import API_BASE_PATH from '../../App.constant';

const UserContext = React.createContext();

const { Provider, Consumer } = UserContext;

const path = '/admin/users/current';

/*eslint-disable react-hooks/exhaustive-deps*/
function UserProvider({ children }) {

    const { get, response } = useFetch(`${API_BASE_PATH}`, {
        cacheLife: 10000,
        cachePolicy: 'cache-first'
    });

    React.useEffect(() => { loadUser() }, []);

    async function loadUser() {
        const user = await get(`${path}`);
        if (response.ok) setUser(user);
    }

    const [user, setUser] = React.useState({});
    return (
        <Provider value={user}>{children}</Provider>
    );
}

function useCurrentUser() {
    const context = React.useContext(UserContext);
    return context;
}


export { UserContext, UserProvider, Consumer as UserConsumer, useCurrentUser };