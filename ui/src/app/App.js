import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Redirect,
    Route
} from "react-router-dom";
import { Provider as HttpProvider } from 'use-http';

import './App.scss';
import { I18nProvider } from './i18n/context/I18n.provider';
import Footer from './core/components/Footer';
import { get_cookie } from './core/utility/get_cookie';

import Dashboard from './dashboard/container/Dashboard';
import Header from './core/components/Header';
import { UserProvider } from './core/user/UserContext';
import { Metadata } from './metadata/Metadata';

function App() {

    const httpOptions = {
        interceptors: {
            request: async ({options, url, path, route}) => {
                options.headers['X-XSRF-TOKEN'] = get_cookie('XSRF-TOKEN');
                return options;
            }
        }
    };

    return (
        <div className="shibui">
            <HttpProvider options={httpOptions}>

            
                <UserProvider>
                    <I18nProvider>
                        <Router>
                            <Header />
                            <main className="pad-content">
                                <Switch>
                                    <Route exact path="/">
                                        <Redirect to="/dashboard" />
                                    </Route>
                                    <Route path="/dashboard" component={Dashboard} />
                                    <Route path="/metadata/:type/:id" component={Metadata} />
                                </Switch>
                            </main>
                            <Footer />
                        </Router>
                    </I18nProvider>
                </UserProvider>
            </HttpProvider>
        </div>
    );
}

/*
<main >
                    <page-title className="sr-only sr-only-focusable"></page-title>
                    <router-outlet></router-outlet>
                    <notification-list></notification-list>
                </main>
*/

export default App;
