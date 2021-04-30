import { faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import FormattedDate from '../../../../core/components/FormattedDate';
import Translate from '../../../../i18n/components/translate';
import { usePropertyWidth } from '../../../component/properties/hooks';




export function MetadataFilterVersionList ({ configuration, columns }) {

    const width = usePropertyWidth(columns);

    const [comparing, setComparing] = React.useState(false);
    const [selected, setSelected] = React.useState(null);

    return (
        <React.Fragment>
            { configuration && configuration.dates.length > 0 &&
                <React.Fragment>
                    <div className="d-flex border-bottom border-light border-2 py-2">
                        <strong style={{width}}>
                            <Translate value={ comparing ? `label.order` : `label.option` } />
                        </strong>
                    {configuration.dates.map(d =>
                            <strong style={{width}} >
                                <FormattedDate date={d} time={true} />
                            </strong>
                        ) }
                    </div>
                    {configuration.filters.map((version, i) =>
                        <div className="d-flex border-bottom border-light">
                            <div style={{width}} className="py-2">
                                { i + 1 }
                            </div>
                            {version.map((filter, n) => 
                                <div style={{width}} className="border-primary">
                                    {filter ?
                                        <div className={`p-2 d-flex align-items-center ${((n % 2 === 0) && selected !== filter.resourceId) ? 'bg-lighter' : 'bg-primary-light'}`}>
                                            <div className="w-50">
                                                <p className="mb-0">{ filter.name }</p>
                                                <p className="mb-0 text-muted">{ filter['@type'] }</p>
                                            </div>
                                            { filter.comparable &&
                                                <button className="btn btn-link mx-auto" onClick={() => setSelected(filter.resourceId)}>
                                                    <FontAwesomeIcon icon={ selected === filter.resourceId ? faCheckSquare : faSquare } size="lg" />
                                                    <span className="sr-only">Compare</span>
                                                </button>
                                            }
                                        </div>
                                        :
                                        <div className="p-2 w-100">-</div>
                                    }
                                </div>
                            )}
                        </div>
                    ) }
                    { configuration &&
                        <React.Fragment>
                            {configuration.filters.length < 1 ?
                                <div className="alert alert-info m-4">
                                    <h3><Translate value="message.no-filters">No Filters</Translate></h3>
                                    <p><Translate value="message.no-filters-added">No filters have been added to this Metadata Provider</Translate></p>
                                </div>
                                :
                                <div className="d-flex justify-content-end my-2">
                                    <button className="btn btn-primary" disabled={!selected} onClick={() => setComparing()}>
                                        <Translate value="label.compare-selected">Compare Selected</Translate>
                                    </button>
                                </div>
                            }
                        </React.Fragment>
                    }
                </React.Fragment>
            }
        </React.Fragment>
    


    );
}
