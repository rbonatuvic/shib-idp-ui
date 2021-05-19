import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

import Translate from '../../i18n/components/translate';
// import { usePagesWithErrors } from '../hoc/MetadataFormContext';

export function MetadataEditorNav ({ definition, current, base, children, format = 'tabs', onNavigate }) {

    const [routes, setRoutes] = React.useState([]);
    const [active, setActive] = React.useState(null);

    // const errors = usePagesWithErrors(definition);

    React.useEffect(() => {
        setRoutes(definition ? definition.steps.map(step => ({ path: step.id, label: step.label })) : [])
    }, [definition]);

    React.useEffect(() => {
        setActive(definition ? definition.steps.find(s => s.id === current)?.label : null);
    }, [current, definition]);

    return (
        <React.Fragment>
            {format === 'dropdown' ?
                <Dropdown>
                    <Dropdown.Toggle caret="true">
                        <FontAwesomeIcon icon={faBars} />&nbsp;
                        <Translate value={active} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {routes.map((route, idx) =>
                            <button
                                type="button"
                                className="dropdown-item"
                                key={route.path}
                                onClick={() => onNavigate(route.path)}
                                aria-label={route.label}>
                                <Translate value={route.label}></Translate>
                            </button>
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
                        <button
                            type="button"
                            key={route.path}
                            className={`btn btn-text nav-link text-left px-3 py-2 mb-1 ${route.path === current ? 'active' : 'text-primary '}`}
                            onClick={() => onNavigate(route.path)}
                            aria-label={route.label}>
                            <Translate value={route.label}></Translate>
                            { /*errors.indexOf(route.path) > -1 &&
                                <FontAwesomeIcon className={`ml-2 ${route.path === current ? '' : 'text-danger'}`} icon={ faExclamationTriangle } />
                            */}
                        </button>
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