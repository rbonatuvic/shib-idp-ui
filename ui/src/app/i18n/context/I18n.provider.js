import React from "react";
import useFetch from 'use-http';
import API_BASE_PATH from '../../App.constant';

const I18nContext = React.createContext();

const { Provider, Consumer } = I18nContext;

const path = '/messages';

/*eslint-disable react-hooks/exhaustive-deps*/
function I18nProvider ({ children }) {

    const { get, response } = useFetch(`${API_BASE_PATH}`, {
        cacheLife: 10000,
        cachePolicy: 'cache-first'
    });

    React.useEffect(() => { loadMessages() }, []);

    async function loadMessages() {
        const msgs = await get(`${path}`);
        if (response.ok) setMessages(msgs);
    }

    const [messages, setMessages] = React.useState({});
    return (
        <>
            {Object.keys(messages).length > 1 && <Provider value={messages}>{children}</Provider>}
        </>
    );
}

export { I18nContext, I18nProvider, Consumer as I18nConsumer };