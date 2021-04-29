import React from 'react';

import { Ordered } from '../../../../dashboard/component/Ordered';
import { Translate } from '../../../../i18n/components/translate';
import { MetadataFiltersContext } from './MetadataFilters';

import { MetadataFilterConfigurationListItem } from './MetadataFilterConfigurationListItem';

export function MetadataFilterConfigurationList ({provider, editable = true}) {
    const filters = React.useContext(MetadataFiltersContext);
    const removeFilter = () => {}

    return (
        <Ordered path={`/MetadataResolvers/${provider.resourceId}/FiltersPositionOrder` } entities={filters}>
            {(ordered, first, last, onOrderUp, onOrderDown) =>
                <>
                    {ordered.length > 0 && 
                    <ul className="list-group list-group-flush">
                        {ordered.map((filter, i) =>
                            <li className="list-group-item" key={i}>
                                <MetadataFilterConfigurationListItem
                                    filter={ filter }
                                    index={i}
                                    isFirst={ first === filter.resourceId }
                                    isLast={ last === filter.resourceId }
                                    editable={ editable }
                                    onOrderDown={onOrderDown}
                                    onOrderUp={onOrderUp}
                                    onRemove={removeFilter}
                                />
                            </li>
                        )}
                    </ul>
                    }
                    { filters && filters.length < 1 &&
                    <div className="alert alert-info m-4">
                        <h3><Translate value="message.no-filters">No Filters</Translate></h3>
                        <p><Translate value="message.no-filters-added">No filters have been added to this Metadata Provider</Translate></p>
                    </div>
                    }
                </>
            }
        </Ordered>
    );
}