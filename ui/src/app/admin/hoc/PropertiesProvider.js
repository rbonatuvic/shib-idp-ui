import React from 'react';
import useFetch from 'use-http';
import API_BASE_PATH from '../../App.constant';


const PropertiesContext = React.createContext();

const { Provider, Consumer } = PropertiesContext;

function PropertiesProvider({ children, cache = 'no-cache' }) {

    const [properties, setProperties] = React.useState([]);


    const { get, response, loading } = useFetch('', {
        cachePolicy: cache
    });

    async function loadProperties() {
        const list = await get(`${API_BASE_PATH}/shib/properties`);
        if (response.ok) {
            setProperties(list);
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => { loadProperties() }, []);

    return (<Provider value={{properties, loading}}>{children}</Provider>);
}

function useProperties() {
    const { properties } = React.useContext(PropertiesContext);
    return properties;
}

function usePropertiesLoading() {
    const { loading } = React.useContext(PropertiesContext);
    return loading;
}

export {
    PropertiesProvider,
    PropertiesContext,
    Consumer as PropertiesConsumer,
    useProperties,
    usePropertiesLoading,
};
