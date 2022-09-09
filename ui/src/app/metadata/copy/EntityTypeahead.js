import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useController } from 'react-hook-form';
import { useMetadataEntity, useMetadataSources } from '../hooks/api';
import Form from 'react-bootstrap/Form';

export function EntityTypeahead ({id, control, name, children}) {
    const { data = [] } = useMetadataSources({}, []);

    const { get, response, loading } = useMetadataEntity();

    const entities = React.useMemo(() => data.map(d => d.entityId), [data]);

    const {
        field: { value, onChange, ...inputProps }
    } = useController({
        name,
        control,
        rules: {
            required: true
        },
        defaultValue: "",
    });

    const loadSelected = async (selected) => {
        const toCopy = data.find(e => e.entityId === selected);

        const source = await get(`/${toCopy.id}`);
        if (response.ok) {
            onChange(source);
        }
        //
    }

    return (
        <React.Fragment>
            <Form.Label htmlFor="target">
                {children}
                {loading && <FontAwesomeIcon icon={faSpinner} size="lg" spin={true} pulse={true} className="ms-2" /> }
            </Form.Label>
            <Typeahead
                {...inputProps}
                onChange={(selected) => selected && selected.length > 0 ? loadSelected(selected[0]) : null}
                defaultInputValue={value ? value.entityId : ''}
                options={entities}
                required={true}
                id={id}
            />
        </React.Fragment>
    )
}