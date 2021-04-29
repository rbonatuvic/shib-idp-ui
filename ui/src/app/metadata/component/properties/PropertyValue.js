import React from 'react';
import { UncontrolledPopover, PopoverBody } from 'reactstrap';

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
                <UncontrolledPopover color="info" trigger="hover" placement="left" target={`Popover-${id}`} delay={500}>
                    <PopoverBody>{value.toString()}</PopoverBody>
                </UncontrolledPopover>
            </>
        : <span className="d-block text-truncate" style={columns ? { width } : {}}>-</span>}
        </>
    );
}