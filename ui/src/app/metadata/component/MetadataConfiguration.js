import React from 'react';
import FormattedDate from '../../core/components/FormattedDate';
import Translate from '../../i18n/components/translate';
import { MetadataSection } from './MetadataSection';
import { usePropertyWidth } from './properties/hooks';

import { ObjectProperty } from './properties/ObjectProperty';

export function MetadataConfiguration ({ configuration }) {

    const onEdit = (value) => console.log(value);

    const columns = configuration.dates?.length || 1;
    const width = usePropertyWidth(columns);

    const editable = configuration.sections?.length <= 1;

    return (
        <>
            { configuration && configuration.sections.map((section, sidx) =>
                <>
                    {section?.properties?.length > 0 && 
                    <MetadataSection section={section} key={sidx} index={ sidx } onEdit={editable ? onEdit : null}>
                        <div className="d-flex border-bottom border-light border-2 py-2">
                            <strong style={ {width} }><Translate value="label.option">Option</Translate></strong>
                            {configuration.dates.map((d, didx) => 
                            <strong style={ { width } } key={didx}>
                                {configuration.dates.length <= 1 ?
                                    <Translate value="label.value">Value</Translate>
                                    :
                                    <FormattedDate date={d} time={true} />
                                }
                            </strong>
                            )}
                        </div>
                        <ObjectProperty property={section} columns={columns}></ObjectProperty>
                    </MetadataSection>
                    }
                </>
            ) }
        </>
    );
}
