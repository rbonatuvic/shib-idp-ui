import React from 'react';
import { NavLink } from 'react-router-dom';

import {Translate} from '../../i18n/components/translate';
import { MetadataXmlContext } from '../hoc/MetadataXmlLoader';

export function MetadataViewToggle () {
    const xml = React.useContext(MetadataXmlContext);

    return (
        <>
            {xml ?
                <div className="btn-group" role="group" aria-label="Options selected">
                    <NavLink className="btn" to="options" activeClassName="btn-primary" aria-pressed="true">
                        <span className="sr-only"><Translate value="action.toggle-view">Toggle view:</Translate></span>
                            Options
                    </NavLink>
                    <NavLink className="btn" to="xml" activeClassName="btn-primary">
                        <span className="sr-only"><Translate value="action.toggle-view">Toggle view:</Translate></span>
                            XML
                    </NavLink>
                </div>
            : ''}
        </>
    );
}