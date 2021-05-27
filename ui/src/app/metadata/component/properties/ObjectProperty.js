import React from 'react';

import { PrimitiveProperty } from './PrimitiveProperty';
import { ArrayProperty } from './ArrayProperty';
import Translate from '../../../i18n/components/translate';

export function ObjectProperty ({ property, columns, onPreview }) {
    const getProperty = (prop, idx) => {
        switch(prop.type) {
            case 'array':
                return <ArrayProperty key={ `p-${idx}` } property={prop} columns={columns} preview={ prop.name === 'label.filter-target-value' } />
            case 'object':
                return <React.Fragment key={`p-${idx}`}>
                    <React.Fragment>
                        {prop.name && <h5 className="border-bottom py-2 mb-0 mt-3"><Translate value={prop.name} /></h5>}
                        <ObjectProperty property={prop} columns={columns} onPreview={onPreview} />
                    </React.Fragment>
                </React.Fragment>
            default:
                return <PrimitiveProperty key={ `p-${idx}`} property={ prop } columns={columns} />
        }
    }

    return (
        <div>
            {property && property.properties.map((prop, pIdx) => getProperty(prop, pIdx))}
        </div>
    );
}
