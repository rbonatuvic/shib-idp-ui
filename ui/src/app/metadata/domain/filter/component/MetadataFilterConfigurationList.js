import React from 'react';

import { Ordered } from '../../../../dashboard/component/Ordered';
import { Translate } from '../../../../i18n/components/translate';
import { MetadataFilters } from './MetadataFilters';

import { MetadataFilterConfigurationListItem } from './MetadataFilterConfigurationListItem';
import { MetadataFilterTypes } from '..';

export function MetadataFilterConfigurationList ({provider, editable = true}) {

    return (
        <MetadataFilters providerId={provider.resourceId} types={MetadataFilterTypes}>
            {(filters, onUpdate, onDelete, onEnable, loading) =>
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
                                        loading={loading}
                                        isFirst={ first === filter.resourceId }
                                        isLast={ last === filter.resourceId }
                                        editable={ editable }
                                        onOrderDown={onOrderDown}
                                        onOrderUp={onOrderUp}
                                        onEnable={ onEnable }
                                        onRemove={() => onDelete(filter.resourceId)}
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
            }
        </MetadataFilters>
    );
}