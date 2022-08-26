import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export function Spinner ({ size, className }) {
    return (<FontAwesomeIcon icon={faSpinner} size={size} spin={true} pulse={true} className={ className } />)
}

export default Spinner;