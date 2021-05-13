import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Translate from '../../i18n/components/translate';

export function InfoIcon ({ value, placement='left', ...props }) {
    return(
        <OverlayTrigger trigger={['hover', 'focus']} placement={placement} overlay={(
            <Popover variant="info">
                <Popover.Content><Translate value={value} /></Popover.Content>
            </Popover>
        )}>
            <FontAwesomeIcon className="text-primary" icon={faInfoCircle} size="lg" {...props} />
        </OverlayTrigger>
    );
}