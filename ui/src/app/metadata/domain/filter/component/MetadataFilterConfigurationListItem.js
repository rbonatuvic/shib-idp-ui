import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleDown, faArrowCircleUp, faChevronUp, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { Translate } from '../../../../i18n/components/translate';
import { Link } from 'react-router-dom';
import { getDefinition } from '../../../domain/index';
import { MetadataConfiguration } from '../../../component/MetadataConfiguration';
import { useMetadataConfiguration } from '../../../hooks/configuration';
import useFetch from 'use-http';

export function MetadataFilterConfigurationListItem ({ filter, isLast, isFirst, onOrderUp, onOrderDown, onEnable, editable, onRemove, loading, index }) {
    const [open, setOpen] = React.useState(false);

    const definition = React.useMemo(() => getDefinition(filter['@type'], ), [filter]);

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

    const configuration = useMetadataConfiguration([filter], schema, definition);
    
    return (<>
        <div className="d-flex justify-content-start align-items-center">
            <span className="me-2">{ index + 1 }</span>
            {editable &&
            <div className="d-flex justify-content-between">
                <Button variant="link" size="sm" onClick={() => onOrderUp(filter.resourceId)} disabled={isFirst}>
                    <FontAwesomeIcon icon={faArrowCircleUp} size='2x' />
                    <span className="sr-only"><Translate value="action.move-up">Move Up</Translate></span>
                </Button>
                <Button variant="link" size="sm" onClick={() => onOrderDown(filter.resourceId)} disabled={isLast}>
                    <FontAwesomeIcon icon={faArrowCircleDown} size='2x' />
                    <span className="sr-only"><Translate value="action.move-up">Move Down</Translate></span>
                </Button>
            </div>
            }
            <Button variant="link" className="mx-4" onClick={ () => setOpen(!open) }>{ filter.name }</Button>
            <span className="">{ filter['@type'] }</span>
            <span className="ms-auto">
                <Form.Check type="switch"
                    id={`customSwitch-${index}`}
                    label={<Translate value={filter.filterEnabled ? 'label.enabled' : 'label.disabled'} />}
                    checked={filter.filterEnabled}
                    disabled={loading}
                    onChange={({ target: { checked } }) => onEnable(filter, checked)} />
                {filter.disabled && <i className="fa fa-spinner fa-pulse fa-lg fa-fw"></i>}
                
            </span>
        </div>
        {open &&
        <div>
            <hr className="my-2" />
            {editable &&
            <div className="d-flex justify-content-end mb-2">
                <div className="d-flex justify-content-between">
                    <Link className="btn btn-link"
                        to={`../filter/${filter.resourceId}/edit/common`}>
                        <FontAwesomeIcon icon={faEdit} className="sr-hidden" />&nbsp;
                        <Translate value="action.edit">Edit</Translate>
                    </Link>
                    <Button variant="link"
                        onClick={() => onRemove(filter.resourceId)}>
                        <FontAwesomeIcon icon={faTrash} className="sr-hidden" />&nbsp;
                        <Translate value="action.delete">Delete</Translate>
                    </Button>
                </div>
            </div>
            }
            {configuration &&
                <MetadataConfiguration configuration={ configuration }/> }
                    <Button variant="link" size="sm" onClick={() => setOpen(!open)}>
                        <FontAwesomeIcon icon={faChevronUp} />&nbsp;
                        <Translate value="action.close">Close</Translate>
                    </Button>
                </div>
            }
    </>);
}