import React from 'react';
import { faCheckSquare, faSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'react-bootstrap/Button';
import { MetadataConfiguration } from '../../../component/MetadataConfiguration';
import { getDefinition } from '../../../domain/index';
import { useMetadataConfiguration } from '../../../hooks/configuration';
import useFetch from 'use-http';

export function MetadataFilterVersionListItem ({ filters, width, selected, index, comparing, limited, onSelect }) {

    const filter = filters.find(f => f.hasOwnProperty('@type'));
    const type = filter['@type'];

    const definition = React.useMemo(() => getDefinition(type), [type]);

    const { get, response } = useFetch(``);

    const [schema, setSchema] = React.useState();

    async function loadSchema(d) {
        const source = await get(`/${d.schema}`)
        if (response.ok) {
            setSchema(source);
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => { loadSchema(definition) }, [definition]);

    const config = useMetadataConfiguration([...filters.filter(f => !!f)], schema, definition, limited);

    return (
        <React.Fragment>
            {!comparing &&
                <div className="d-flex border-bottom border-light">
                    <div style={{ width }} className="py-2">
                        {index + 1}
                    </div>
                    {filters.map((filter, n) =>
                        <React.Fragment key={n}>
                            
                            <div style={{ width }} className="border-primary">
                                {filter ?
                                    <div className={`p-2 d-flex align-items-center ${(selected === filter.resourceId) ? 'bg-primary-light' : ((n % 2 === 0) ? '' : 'bg-lighter')}`}>
                                        <div className="w-50">
                                            <p className="mb-0">{filter.name}</p>
                                            <p className="mb-0 text-muted">{filter['@type']}</p>
                                        </div>
                                        {filter.comparable &&
                                            <Button variant="link" className="mx-auto" onClick={() => onSelect(filter.resourceId)}>
                                                <FontAwesomeIcon icon={selected === filter.resourceId ? faCheckSquare : faSquare} size="lg" />
                                                <span className="sr-only">Compare</span>
                                            </Button>
                                        }
                                    </div>
                                    :
                                    <div className="p-2 w-100">-</div>
                                }
                            </div>
                            
                        </React.Fragment>
                    )}
                </div>
            }
            {comparing === filter.resourceId &&
                <MetadataConfiguration configuration={config} />
            }
        </React.Fragment>
    );
}