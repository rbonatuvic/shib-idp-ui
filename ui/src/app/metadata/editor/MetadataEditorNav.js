import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { NavLink } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';

import Translate from '../../i18n/components/translate';

export function MetadataEditorNav ({ definition, current, base, children, format = 'tabs' }) {

    const [routes, setRoutes] = React.useState([]);
    const [active, setActive] = React.useState(null);

    React.useEffect(() => {
        setRoutes(definition ? definition.steps.map(step => ({ path: step.id, label: step.label })) : [])
    }, [definition]);

    React.useEffect(() => {
        setActive(definition ? definition.steps.find(s => s.id === current)?.label : null);

        console.log(definition.steps, current);
    }, [current, definition]);

    return (
        <React.Fragment>
            {format === 'dropdown' ?
                <Dropdown>
                    <Dropdown.Toggle caret>
                        <FontAwesomeIcon icon={faBars} />&nbsp;
                        <Translate value={active} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {routes.map((route, idx) =>
                            <NavLink
                                className="dropdown-item"
                                key={route.path}
                                to={`${route.path}`}
                                aria-label={route.label}>
                                <Translate value={route.label}></Translate>
                            </NavLink>
                        )}
                        {children &&
                        <React.Fragment>
                            <Dropdown.Item divider />
                            {children}
                        </React.Fragment>
                        }
                    </Dropdown.Menu>
                </Dropdown>
            : 
            <React.Fragment>
                <nav className="nav nav-pills flex-column" role="navigation">
                    {routes.map((route, idx) =>
                        <NavLink
                            key={route.path}
                            className={`nav-link`}
                            to={`${route.path}`}
                            role="button"
                            aria-label={route.label}>
                            <Translate value={route.label}></Translate>
                        </NavLink>
                    )}
                </nav>
                <hr />
                <nav className="nav nav-pills flex-column" role="navigation">
                    { children }
                </nav>
            </React.Fragment>
            }
            
        </React.Fragment>
    );
}