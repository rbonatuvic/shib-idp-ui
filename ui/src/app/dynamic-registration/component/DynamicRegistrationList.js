import React from 'react';
import { Link } from 'react-router-dom';
import Translate from '../../i18n/components/translate';
import { Scroller } from '../../dashboard/component/Scroller';

export function DynamicRegistrationList ({entities, children}) {
    return (
        <React.Fragment>
            <Scroller entities={entities}>
            {(limited) =>
                <div className="table-responsive mt-3 source-list">
                    <table className="table table-striped w-100 table-hover">
                        <thead>
                            <tr>
                                <th className="w-25"><Translate value="label.title">Title</Translate></th>
                            </tr>
                        </thead>
                        <tbody>
                            {limited.map((reg, idx) =>
                                <tr key={idx}>
                                    <td className="align-middle">
                                        <Link to={`/dynamic-registration/${reg.resourceId}`}>{reg.name}</Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            }
            </Scroller>
            {children}
        </React.Fragment>
    );
}