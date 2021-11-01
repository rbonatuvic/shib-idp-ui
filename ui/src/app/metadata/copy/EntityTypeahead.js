import React from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useController } from 'react-hook-form';
import { useMetadataSources } from '../hooks/api';

export function EntityTypeahead ({id, control, name}) {
    const { data = [] } = useMetadataSources({}, []);
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

    return (
        <Typeahead
            {...inputProps}
            onChange={(selected) => onChange(selected ? data.find(e => e.entityId === selected[0]) : '')}
            defaultInputValue={value ? value.entityId : ''}
            options={entities}
            required={true}
            id={id}
        />
    )
}