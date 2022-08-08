import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import Button from 'react-bootstrap/Button';
import FormattedDate from '../../core/components/FormattedDate';

import Translate from '../../i18n/components/translate';
import { useMetadataHistory } from '../hooks/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../core/components/Spinner';

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

    const { data, loading } = useMetadataHistory(type, id, {
        cachePolicy: 'no-cache'
    }, []);

    const toggleVersionSelected = (version) => {
        let s = [...selected];
        if (s.indexOf(version) > -1) {
            s = s.filter(i => i !== version);
        } else {
            s = [...s, version];
        }
        setSelected(s);
    };
    const compare = (versions) => {
        const s = sortVersionsByDate(versions);
        const path = `/metadata/${type}/${id}/configuration/compare?${queryString.stringify({versions: s.map(s => s.id)}, {
            skipNull: true,
        })}`;
        history.push(path);
    };

    const [selected, setSelected] = React.useState([]);

    const [sorted, setSorted] = React.useState([]);

    React.useEffect(() => {
        if (data && data.length) {
            setSorted(sortVersionsByDate(data));
        }
    }, [data]);

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
                        {sorted.map((version, i) =>
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
                                    <Link className="btn btn-text btn-link" to={`/metadata/${type}/${id}/restore/${version.id}/common`}>
                                        <FontAwesomeIcon icon={faUndo} />&nbsp;
                                        <Translate value="action.restore">Restore</Translate>
                                    </Link>
                                    }
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {loading && <div className="d-flex justify-content-center text-primary"><Spinner size="4x" /></div> }
                <Button variant="primary" onClick={ () => compare(selected) } disabled={!selected.length}>
                    <Translate value="label.compare-selected">Compare Selected</Translate>
                    {selected.length > 0 && <span>({ selected.length })</span> }
                </Button>
                </>
            </div>}
        </>
    );
}