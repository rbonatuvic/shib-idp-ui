import React from 'react';
import FormattedDate from '../../core/components/FormattedDate';
import Translate from '../../i18n/components/translate';
import { MetadataSection } from './MetadataSection';
import { usePropertyWidth } from './properties/hooks';

import { ObjectProperty } from './properties/ObjectProperty';

export function MetadataConfiguration ({ configuration, onEdit }) {

    const columns = configuration?.dates?.length || 1;
    const width = usePropertyWidth(columns);

    React.useEffect(() => console.log(configuration), [configuration]);

    return (
        <>
            { configuration && configuration.sections.map((section, sidx) =>
                <React.Fragment key={sidx}>
                    {section?.properties?.length > 0 && 
                    <MetadataSection section={section} key={sidx} index={ configuration.sections.length > 1 ? sidx : -1 } onEdit={onEdit}>
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
                </React.Fragment>
            ) }
        </>
    );
}
