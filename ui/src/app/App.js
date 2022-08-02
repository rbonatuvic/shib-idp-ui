import React from 'react';
import {
    BrowserRouter as Router,
    Redirect,
} from "react-router-dom";

import {
    Switch,
    Route,
} from "react-router";
import { QueryParamProvider } from 'use-query-params';
import { Provider as HttpProvider } from 'use-http';
import Button from 'react-bootstrap/Button';

import './App.scss';
import { I18nProvider } from './i18n/context/I18n.provider';
import Footer from './core/components/Footer';
import { get_cookie } from './core/utility/get_cookie';

import Dashboard from './dashboard/view/Dashboard';
import Header from './core/components/Header';
import { UserProvider } from './core/user/UserContext';
import { Metadata } from './metadata/Metadata';
import { Attribute } from './metadata/Attribute';
import { Notifications } from './notifications/hoc/Notifications';
import { NotificationList } from './notifications/component/NotificationList';
import { UserConfirmation, ConfirmWindow } from './core/components/UserConfirmation';
import { NewSource } from './metadata/new/NewSource';
import { NewProvider } from './metadata/new/NewProvider';
import { Filter } from './metadata/Filter';
import { Contention } from './metadata/contention/ContentionContext';
import { SessionModal } from './core/user/SessionModal';
import { Roles } from './admin/Roles';
import { Groups } from './admin/Groups';
import { BASE_PATH } from './App.constant';
import { ProtectRoute } from './core/components/ProtectRoute';


function App() {

    const [showTimeout] = React.useState();

    const httpOptions = {
        cachePolicy: 'no-cache',
        redirect: 'manual',
        interceptors: {
            request: async ({options, url, path, route}) => {
                options.headers['X-XSRF-TOKEN'] = get_cookie('XSRF-TOKEN');

                return options;
            },
            response: async ({response}) => {
                if (response.type === "opaqueredirect") {
                    //setShowTimeout(true);
                }

                return response;
            }
        }
    };

    return (
        <div className="app-root d-flex flex-column justify-content-between">
            <HttpProvider options={httpOptions}>
                <Notifications>
                    <UserProvider>
                        <I18nProvider>
                            <SessionModal show={showTimeout}>
                                <Button variant="primary" onClick={() => window.location.reload()}>Log in</Button>
                            </SessionModal>
                            <Contention>
                                <UserConfirmation>
                                    {(message, confirm, confirmCallback, setConfirm, getConfirmation) =>
                                        <Router getUserConfirmation={getConfirmation} basename={BASE_PATH}>
                                            <ConfirmWindow message={message} confirm={confirm} confirmCallback={confirmCallback} setConfirm={setConfirm} />
                                            <QueryParamProvider ReactRouterRoute={Route}>
                                            <Header />
                                            <main className="pad-content">
                                                <Switch>
                                                    <Route exact path="/">
                                                        <Redirect to="/dashboard" />
                                                    </Route>
                                                    <Route path="/dashboard" component={Dashboard} />
                                                    <Route path="/metadata/source/new" component={NewSource} />
                                                    <Route path="/metadata/provider/new" render={() =>
                                                        <ProtectRoute redirectTo="/dashboard">
                                                            <NewProvider />
                                                        </ProtectRoute>
                                                    } />
                                                    <Route path="/metadata/attributes"  render={() =>
                                                        <ProtectRoute redirectTo="/dashboard">
                                                            <Attribute />
                                                        </ProtectRoute>
                                                    } />
                                                    <Route path="/metadata/provider/:id/filter"  render={() =>
                                                        <ProtectRoute redirectTo="/dashboard">
                                                            <Filter />
                                                        </ProtectRoute>
                                                    } />
                                                    <Route path="/metadata/:type/:id" component={Metadata} />
                                                    <Route path="/roles" render={() =>
                                                        <ProtectRoute redirectTo="/dashboard">
                                                            <Roles />
                                                        </ProtectRoute>
                                                    } />
                                                    <Route path="/groups" render={() =>
                                                        <ProtectRoute redirectTo="/dashboard">
                                                            <Groups />
                                                        </ProtectRoute>
                                                    } />
                                                    <Route path="*">
                                                        <Redirect to="/dashboard" />
                                                    </Route>
                                                </Switch>
                                                <NotificationList />
                                            </main>
                                            <Footer />
                                            </QueryParamProvider>
                                        </Router>
                                    }
                                </UserConfirmation>
                            </Contention>
                        </I18nProvider>
                    </UserProvider>
                </Notifications>
            </HttpProvider>
        </div>
    );
}
export default App;
