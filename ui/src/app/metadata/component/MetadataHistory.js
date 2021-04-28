import React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import FormattedDate from '../../core/components/FormattedDate';

import Translate from '../../i18n/components/translate';
import { useMetadataHistory } from '../hooks/api';

export function MetadataHistory () {
    const { type, id } = useParams();

    const { data, loading } = useMetadataHistory(type, id, {}, []);

    const toggleVersionSelected = () => {};
    const restore = () => {};
    const compare = () => {};

    const selected = [];

    return (
        <>
            <h2 className="mb-4">
                <Translate value="label.version-history">version history</Translate>
            </h2>
            {data && !loading && <div className="container">
                <>
                <table className="table">
                    <caption className="sr-only"><Translate value="label.name-and-entityid">Metadata Version History</Translate></caption>
                    <thead>
                        <tr>
                            <th scope="col">
                                <span className="sr-only"><Translate value="label.select-version">Select Version</Translate></span>
                            </th>
                            <th scope="col"><Translate value="label.save-date">Save Date</Translate></th>
                            <th scope="col"><Translate value="label.changed-by">Changed By</Translate></th>
                            <th scope="col"><Translate value="label.actions">Actions</Translate></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((version, i) =>
                            <tr key={i}>
                                <td>
                                    <div className="custom-control custom-checkbox" onClick={() => toggleVersionSelected(version)}>
                                        <input title={`check-${i}`} type="checkbox" className="custom-control-input" checked={selected.indexOf(version) > -1} onChange={() => {}} />
                                        <label className="custom-control-label" htmlFor={`check-${i}`}>
                                            <span className="sr-only"><Translate value="label.check-to-select">Check to select</Translate></span>
                                        </label>
                                    </div>
                                </td>
                                <td>
                                    {i === 0 ? <Link to="['../', 'options']">
                                        <FormattedDate date={version.date} />&nbsp;(<Translate value="label.current">Current</Translate>)
                                    </Link>
                                    :
                                    <Link to="['../', 'version', version.id, 'options']">
                                        <FormattedDate date={version.date} />
                                    </Link>
                                    }
                                </td>
                                <td>{ version.creator }</td>
                                <td>
                                    {i > 0 &&
                                    <button className="btn btn-text btn-link" onClick={ () => restore(version) }>
                                        <i className="fa fa-undo"></i>&nbsp;
                                        <Translate value="action.restore">Restore</Translate>
                                    </button>
                                    }
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <button className="btn btn-primary" onClick={ () => compare() } disabled={!selected.length}>
                    <Translate value="label.compare-selected">Compare Selected</Translate>
                    {selected.length > 0 && <span>({ selected.length })</span> }
                </button>
                </>
            </div>}
            {loading && <div className="d-flex justify-content-center">
                <i className="fa fa-spinner fa-pulse fa-4x fa-fw"></i>
                <span className="sr-only">Loading...</span>
            </div>}
        </>
    );
}