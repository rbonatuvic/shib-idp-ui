import React from 'react';
import Translate from '../../i18n/components/translate';
import { Search } from '../component/Search';

import {DynamicRegistrationList} from '../../dynamic-registration/component/DynamicRegistrationList';
import {
    useGetDynamicRegistrationsQuery
} from '../../store/dynamic-registration/DynamicRegistrationSlice';
import { DynamicRegistrationActions } from '../../dynamic-registration/hoc/DynamicRegistrationActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import Spinner from '../../core/components/Spinner';
import { faOpenid } from '@fortawesome/free-brands-svg-icons';

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
                                        onChangeGroup={(registration, group) => changeGroup({ registration, group })}>
                                            {loading && <div className="d-flex justify-content-center text-primary"><Spinner size="4x" /></div> }
                                            {(!searched || !searched.length) &&
                                                <div className="d-flex justify-content-center">
                                                    <div className="w-25 alert alert-info m-3 d-flex flex-column align-items-center">
                                                        <p className="text-center">No Dynamic Registrations found.</p>
                                                        <Link to="/dynamic-registration/new" className="btn btn-primary" id="dynamic-reg-create-btn">
                                                            <FontAwesomeIcon icon={faOpenid} className="me-2" fixedWidth />
                                                            <Translate value="action.add-new-dynamic-registration" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            }
                                    </DynamicRegistrationList>
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