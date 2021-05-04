import React from 'react';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import { usePropertyWidth } from './hooks';

export function PropertyValue ({ name, value, columns }) {

    const width = usePropertyWidth(columns);

    return (
        <>
        { name && value !== null && value !== undefined  ? 
                <OverlayTrigger trigger={['hover', 'focus']} placement="left" overlay={(
                    <Popover variant="info">
                        <Popover.Content>{value.toString()}</Popover.Content>
                    </Popover>
                )}>
                <span
                    className="d-block text-truncate"
                    role="definition"
                    style={columns ? { width } : {}}>
                    {value !== undefined ? value.toString() : (value === false) ? value.toString() : '-'}
                </span>
            </OverlayTrigger>
        : <span className="d-block text-truncate" style={columns ? { width } : {}}>-</span>}
        </>
    );
}