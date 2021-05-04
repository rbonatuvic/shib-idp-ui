import React from 'react';
import Popover from 'react-bootstrap/Popover';

import { usePropertyWidth } from './hooks';
import { useGuid } from '../../../core/hooks/utils';

export function PropertyValue ({ name, value, columns }) {

    const width = usePropertyWidth(columns);

    const id = useGuid();

    return (
        <>
        { name && value !== null && value !== undefined  ? 
            <>
                <span
                    id={`Popover-${id}`}
                    className="d-block text-truncate"
                    role="definition"
                    style={columns ? { width } : {}}>
                    {value !== undefined ? value.toString() : (value === false) ? value.toString() : '-'}
                </span>
                <Popover variant="info" trigger="hover" placement="left" target={`Popover-${id}`}>
                    <Popover.Content>{value.toString()}</Popover.Content>
                </Popover>
            </>
        : <span className="d-block text-truncate" style={columns ? { width } : {}}>-</span>}
        </>
    );
}