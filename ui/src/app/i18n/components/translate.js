import React from 'react';
import PropTypes from 'prop-types';

import { useTranslation } from '../hooks';

export function Translate ({ value, params = {} }) {
    const translated = useTranslation(value, params);
    return (<>{translated || value}</>)
}

Translate.propTypes = {
    key: PropTypes.string,
    params: PropTypes.object
};

export default Translate;