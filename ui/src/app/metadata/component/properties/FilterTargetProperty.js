import React from 'react';
import { ArrayProperty } from './ArrayProperty';
import { PrimitiveProperty } from './PrimitiveProperty';

export function FilterTargetProperty ({ property, columns, onPreview }) {
    return (
        <>
            {property.properties.map((prop, idx) =>
                <React.Fragment key={idx}>
                    { prop.type === 'array' ?
                    <ArrayProperty property={prop} columns={columns} onPreview={onPreview} />
                    :
                    <PrimitiveProperty property={prop} columns={columns} />
                    }
                </React.Fragment>
            )}
        </>
    );
}