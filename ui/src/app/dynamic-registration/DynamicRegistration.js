import React from 'react';
import { useDynamicRegistrationDispatcher } from './hoc/DynamicRegistrationContext';
import Translate from '../i18n/components/translate';
import { Search } from '../dashboard/component/Search';

import {DynamicRegistrationList} from './component/DynamicRegistrationList';

const searchProps = ['name'];

export function DynamicRegistration () {

    // const dispatcher = useDynamicRegistrationDispatcher();

    /*eslint-disable react-hooks/exhaustive-deps*/
    // React.useEffect(() => { loadRegistrations() }, []);
    const registrations = [];

    return (
        <section className="section">
            <div className="section-body border border-top-0 border-primary">
                <>
                    <div className="section-header bg-primary p-2 text-light">
                        <span className="lead">
                            <Translate value="label.current-dynamic-registrations">Dynamic Registrations</Translate>
                        </span>
                    </div>
                    <div className="p-3">
                        <Search entities={registrations} searchable={searchProps}>
                            {(searched) =>
                            <DynamicRegistrationList entities={searched} />
                            }
                        </Search>
                    </div>
                </>
            </div>
        </section>
    )
}