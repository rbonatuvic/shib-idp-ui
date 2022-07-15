import React from 'react';
import { useParams } from 'react-router';
import { getMetadataPath } from '../hooks/api';
import API_BASE_PATH from '../../App.constant';
import useFetch from 'use-http';
import { last } from 'lodash';
import Spinner from '../../core/components/Spinner';

export function MetadataVersionsLoader ({versions, children}) {

    const ref = React.useRef({});
    const [list, setList] = React.useState({});

    const [loading, setLoading] = React.useState(false);

    const { type, id } = useParams();

    const { get, response } = useFetch(`/${API_BASE_PATH}${getMetadataPath(type)}/${id}/Versions`, {
        cachePolicy: 'no-cache',
    }, []);

    async function loadVersion(v) {
        const l = await get(`/${v}`);
        if (response.ok) {
            addToList(v, l);
            if (last(versions) !== v) {
                loadNext(versions[versions.indexOf(v) + 1]);
            } else {
                setLoading(false);
            }
        }
    }

    function addToList(version, item) {
        ref.current = {
            ...ref.current,
            [version]: item
        };
        setList(ref.current);
    }

    function loadNext (v) {
        loadVersion(v);
        
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => {
        loadNext(versions[0]);
        setLoading(true);
    }, [versions]);

    return (
        <React.Fragment>
            {children(versions.map(v => list[v]).filter(v => !!v))}
            {loading && <div className="d-flex justify-content-center text-primary"><Spinner size="4x" /></div> }
        </React.Fragment>
    );
}