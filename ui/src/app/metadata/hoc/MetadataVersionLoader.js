import React from 'react';
import { useParams } from 'react-router';
import { getMetadataPath } from '../hooks/api';
import API_BASE_PATH from '../../App.constant';
import useFetch from 'use-http';
import { last } from 'lodash';

export function MetadataVersionLoader ({versions, children}) {

    const ref = React.useRef({});
    const [list, setList] = React.useState({});

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
    }, [versions]);

    return (<React.Fragment>
        {children(versions.map(v => list[v]).filter(v => !!v))}
    </React.Fragment>);
}