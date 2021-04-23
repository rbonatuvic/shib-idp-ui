import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Redirect,
    Route
} from "react-router-dom";


import './App.scss';
import { I18nProvider } from './i18n/context/I18n.provider';
import Footer from './core/components/Footer';

import Dashboard from './dashboard/container/Dashboard';
import Header from './core/components/Header';

function App() {
    return (
        <div className="shibui">
        <I18nProvider>
            <Router>
                <Header />
                <main className="pad-content">
                    <Switch>
                        <Route exact path="/">
                            <Redirect to="/dashboard" />
                        </Route>
                        <Route path="/dashboard" component={Dashboard} />
                    </Switch>
                </main>
                <Footer />
            </Router>
        </I18nProvider>
        </div>
    );
}

/*
<main >
                    <page-title class="sr-only sr-only-focusable"></page-title>
                    <router-outlet></router-outlet>
                    <notification-list></notification-list>
                </main>
*/

export default App;
