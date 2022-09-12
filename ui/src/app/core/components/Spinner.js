import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export function Spinner (props) {
    return (<FontAwesomeIcon icon={faSpinner} spin={true} pulse={true} { ...props } />)
}

export default Spinner;