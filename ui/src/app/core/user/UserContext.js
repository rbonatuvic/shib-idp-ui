import React from "react";
import useFetch from 'use-http';
import API_BASE_PATH from '../../App.constant';

const UserContext = React.createContext();

const { Provider, Consumer } = UserContext;

const path = '/admin/users/current';

/*eslint-disable react-hooks/exhaustive-deps*/
function UserProvider({ children }) {

    const { get, response, loading } = useFetch(`${API_BASE_PATH}`, {
        cachePolicy: 'no-cache'
    });

    React.useEffect(() => { loadUser() }, []);

    async function loadUser() {
        const user = await get(`${path}`);
        if (response.ok) {
            setUser(user);
        }
    }

    const [user, setUser] = React.useState({});

    const providerValue = React.useMemo(() => ({ user, loading, loadUser }), [user, loading, loadUser]);

    return (
        <Provider value={providerValue}>{children}</Provider>
    );
}

function useCurrentUser() {
    const { user } = React.useContext(UserContext);
    return user;
}

function useCurrentUserLoading() {
    const { loading } = React.useContext(UserContext);
    return loading;
}

function useCurrentUserLoader() {
    const { loadUser } = React.useContext(UserContext);
    return loadUser;
}

function useIsAdmin() {
    const user = useCurrentUser();
    return user.role === 'ROLE_ADMIN';
}

function useIsEnabler() {
    const user = useCurrentUser();
    return user.role === 'ROLE_ENABLE';
}

function useIsInGroup(id) {
    const user = useCurrentUser();
    return user.group === id;
}

function useIsAdminOrInGroup() {
    const isAdmin = useIsAdmin();
    const isInGroup = useIsInGroup();
    return isAdmin || isInGroup;
}

function useCanEnable() {
    const isAdmin = useIsAdmin();
    const isEnabler = useIsEnabler();
    return isAdmin || isEnabler;
}

function useUserGroup() {
    const user = useCurrentUser();
    return (user?.userGroups && user.userGroups.length > 0) ? user.userGroups[0] : null;
}

function useUserGroups() {
    const user = useCurrentUser();
    return (user?.userGroups && Array.isArray(user.userGroups)) ? user.userGroups : [];
}

function useUserGroupNames() {
    const groups = useUserGroups();
    return groups.map(g => g.name).join(', ');
}

function useUserGroupRegexValidator () {
    const user = useCurrentUser();
    return (user?.userGroups && user.userGroups.length > 0) ? user?.userGroups[0].validationRegex : null;
}


export {
    UserContext,
    UserProvider,
    Consumer as UserConsumer,
    useCurrentUser,
    useIsAdmin,
    useIsAdminOrInGroup,
    useCanEnable,
    useCurrentUserLoading,
    useCurrentUserLoader,
    useUserGroupRegexValidator,
    useUserGroup,
    useUserGroupNames
};
