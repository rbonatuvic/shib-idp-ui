import React from 'react';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import { usePropertyWidth } from './hooks';
import Translate from '../../../i18n/components/translate';

export function PropertyValue ({ name, value, columns, className }) {

    const width = usePropertyWidth(columns);

    return (
        <>
        { name && value !== null && value !== undefined  ? 
                <OverlayTrigger trigger={['hover', 'focus']} placement="left" overlay={(
                    <Popover variant="info">
                        <Popover.Body><Translate value={value.toString()}>{value.toString()}</Translate></Popover.Body>
                    </Popover>
                )}>
                <span
                    className={`d-block text-truncate ${className}`}
                    role="definition"
                    style={columns ? { width } : {}}>
                    <Translate value={value !== undefined ? value.toString() : (value === false) ? value.toString() : '-'}>
                        {value !== undefined ? value.toString() : (value === false) ? value.toString() : '-'}
                    </Translate>
                </span>
            </OverlayTrigger>
        : <span className={`d-block text-truncate ${className}`} style={columns ? { width } : {}}>-</span>}
        </>
    );
}