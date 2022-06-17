import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import Translate from '../../i18n/components/translate';
import { useTranslator } from '../../i18n/hooks';

export function InfoIcon ({ value = '', placement='left', ...props }) {
    const translate = useTranslator();
    return(
        <OverlayTrigger trigger={['hover', 'focus', 'click']} placement={placement} overlay={(
            <Popover variant="info">
                <Popover.Body><Translate value={value} /></Popover.Body>
            </Popover>
        )}
        aria-label={translate('tooltip.instruction')}>
            <Button variant="text">
                <span className="sr-only">Description</span>
                <FontAwesomeIcon className="text-primary" icon={faInfoCircle} size="lg" {...props} />
            </Button>
        </OverlayTrigger>
    );
}