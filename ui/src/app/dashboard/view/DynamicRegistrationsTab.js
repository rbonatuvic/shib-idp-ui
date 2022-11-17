import React from 'react';
import Translate from '../../i18n/components/translate';
import { Search } from '../component/Search';

import {DynamicRegistrationList} from '../../dynamic-registration/component/DynamicRegistrationList';
import {
    useGetDynamicRegistrationsQuery
} from '../../store/dynamic-registration/DynamicRegistrationSlice';
import { DynamicRegistrationActions } from '../../dynamic-registration/hoc/DynamicRegistrationActions';

const searchProps = ['name'];

export function DynamicRegistrationsTab () {

    const {data: registrations = [], isLoading: loading} = useGetDynamicRegistrationsQuery();

    return (
        <section className="section">
            <div className="section-body border border-top-0 border-primary">
                <DynamicRegistrationActions>
                    {({enable, remove, changeGroup}) => (
                        <React.Fragment>
                            <div className="section-header bg-primary p-2 text-light">
                                <span className="lead">
                                    <Translate value="label.current-dynamic-registrations">Dynamic Registrations</Translate>
                                </span>
                            </div>
                            <div className="p-3">
                                <Search entities={registrations} searchable={searchProps}>
                                    {(searched) =>
                                    <DynamicRegistrationList
                                        entities={searched}
                                        loading={loading}
                                        onDelete={(id) => remove({id})}
                                        onEnable={(id, enabled) => enable({id, enabled}) }
                                        onChangeGroup={(registration, group) => changeGroup({ registration, group })}/>
                                    }
                                </Search>
                            </div>
                        </React.Fragment>
                    )}
                </DynamicRegistrationActions>
            </div>
        </section>
    )
}