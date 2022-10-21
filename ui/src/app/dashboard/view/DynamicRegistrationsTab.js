import React from 'react';
// import { useDynamicRegistrationDispatcher } from '../../dynamic-registration/hoc/DynamicRegistrationContext';
import Translate from '../../i18n/components/translate';
import { Ordered } from '../component/Ordered';
import { Search } from '../component/Search';

import {DynamicRegistrationList} from '../../dynamic-registration/component/DynamicRegistrationList';

const searchProps = ['name'];

export function DynamicRegistrationsTab () {

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
                        <Ordered entities={registrations} prop="resourceIds">
                            {(ordered, first, last, onOrderUp, onOrderDown) =>
                            <Search entities={ordered} searchable={searchProps}>
                                {(searched) =>
                                <DynamicRegistrationList entities={searched} />
                                }
                            </Search>
                            }
                        </Ordered>
                    </div>
                </>
            </div>
        </section>
    )
}