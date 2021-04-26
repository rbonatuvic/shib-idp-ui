import React from 'react';

import Translate from '../../../i18n/components/translate';

import { usePropertyWidth } from './hooks';
import { PropertyValue } from './PropertyValue';

export function PrimitiveProperty ({ property, columns }) {

    const width = usePropertyWidth(columns);

    return (
        <div tabIndex="0">
            {property.differences && <span className="sr-only">Changed:</span> }
            {property.name &&
                <>
                    <div className={`d-flex border-bottom border-light p-2 ${property.differences ? 'bg-diff' : ''}`}>
                        <span className="d-block"
                            role="term"
                            style={{width}}>
                                <Translate value={property.name}>{ property.name }</Translate>
                        </span>
                        {property.value.map((v, valIdx) =>
                            <PropertyValue key={`prop-${valIdx}`} value={v} name={property.name} columns={columns} index={valIdx} />
                        ) }
                    </div>
                    
                </>
            }
        </div>
    );
}
/**/