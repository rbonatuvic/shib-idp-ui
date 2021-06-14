import React from 'react';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'react-bootstrap/Button';
import FormattedDate from '../../../../core/components/FormattedDate';
import Translate from '../../../../i18n/components/translate';
import { usePropertyWidth } from '../../../component/properties/hooks';
import { MetadataFilterVersionListItem } from './MetadataFilterVersionListItem';

export function MetadataFilterVersionList ({ configuration, limited, columns }) {

    const width = usePropertyWidth(columns);

    const [comparing, setComparing] = React.useState(false);
    const [selected, setSelected] = React.useState(null);

    const resetFilterComparison = () => {
        setComparing(false);
        setSelected(null);
    }

    return (
        <React.Fragment>
            { configuration && configuration.dates.length > 0 &&
                <React.Fragment>
                    {!comparing ? <div className="d-flex border-bottom border-light border-2 py-2">
                        <strong style={{width}}>
                            <Translate value={ comparing ? `label.order` : `label.option` } />
                        </strong>
                        {configuration.dates.map((d, didx) =>
                            <strong style={{width}} key={didx}>
                                <FormattedDate date={d} time={true} />
                            </strong>
                        ) }
                    </div> : <br /> }
                    {configuration.filters.map((version, i) =>
                        <MetadataFilterVersionListItem
                            limited={limited}
                            filters={version}
                            key={i}
                            width={width}
                            index={i}
                            selected={selected}
                            comparing={comparing}
                            onSelect={(id) => setSelected(id)} />
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
                                    {comparing ? 
                                        <Button variant="success" onClick={resetFilterComparison}>
                                            <FontAwesomeIcon icon={faArrowLeft} />&nbsp;
                                            <Translate value="label.filter-versions">Filter Versions</Translate>
                                        </Button>
                                    :
                                    <Button variant="primary" disabled={!selected} onClick={() => setComparing(selected)}>
                                        <Translate value="label.compare-selected">Compare Selected</Translate>
                                    </Button>
                                    }
                                </div>
                            }
                        </React.Fragment>
                    }
                </React.Fragment>
            }
        </React.Fragment>
    );
}
