import React from 'react';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import queryString from 'query-string';

import FormattedDate from '../../core/components/FormattedDate';

import Translate from '../../i18n/components/translate';
import { useMetadataHistory } from '../hooks/api';

const sortVersionsByDate = (versions) => {
    return versions.sort((a, b) => {
        const aDate = new Date(a.date).getTime();
        const bDate = new Date(b.date).getTime();
        return aDate === bDate ? 0 : aDate < bDate ? -1 : 1;
    }).reverse();
}

export function MetadataHistory () {
    const { type, id } = useParams();

    const history = useHistory();

    const { data, loading } = useMetadataHistory(type, id, {}, []);

    const toggleVersionSelected = (version) => {
        let s = [...selected];
        if (s.indexOf(version) > -1) {
            s = s.filter(i => i !== version);
        } else {
            s = [...s, version];
        }
        setSelected(s);
    };
    const restore = () => {};
    const compare = (versions) => {
        const sorted = sortVersionsByDate(versions);
        const path = `/metadata/${type}/${id}/configuration/compare?${queryString.stringify({versions: sorted.map(s => s.id)}, {
            skipNull: true,
        })}`;
        history.push(path);
    };

    const [selected, setSelected] = React.useState([]);

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
                                    {i === 0 ? <Link to={`/metadata/${type}/${id}/configuration/options` }>
                                        <FormattedDate time={true} date={version.date} />&nbsp;(<Translate value="label.current">Current</Translate>)
                                    </Link>
                                    :
                                    <Link to={`/metadata/${type}/${id}/configuration/version/${version.id}/options`}>
                                        <FormattedDate time={true} date={version.date} />
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
                <button className="btn btn-primary" onClick={ () => compare(selected) } disabled={!selected.length}>
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