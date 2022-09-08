import React, { Fragment, useCallback } from 'react';
import { groupBy, includes, orderBy } from 'lodash';
import { Highlighter, Menu, MenuItem, Token, Typeahead } from 'react-bootstrap-typeahead';
import Button from 'react-bootstrap/Button';

import { ToggleButton } from '../../form/component/ToggleButton';

export function PropertySelector ({ properties, options, onAddProperties }) {
    const [selected, setSelected] = React.useState([]);

    const menu = useCallback((results, menuProps, state) => {
        let index = 0;
        const ordered = orderBy(results, 'category');
        const grouped = groupBy(ordered, 'category');
        const items = Object.keys(grouped).sort().map((item, idx) => {
            index = index + 1;
            const used = grouped[item].filter((i) => properties.some((p) => p.propertyName === i.propertyName));
            if (used.length >= grouped[item].length || includes(selected, item)) {
                return <Fragment key={item}></Fragment>
            }
            const cat = {category: item, propertyName: item, isCategory: true};
            const catSelected = selected.some(s => s.propertyName === item);
            return (
                <Fragment key={item}>
                    {index !== 0 && <Menu.Divider />}
                    <Menu.Header>
                        <MenuItem key={index}
                            option={cat}
                            position={index}
                            className="fw-bold"
                            disabled={catSelected}>
                                {item} - Add all
                        </MenuItem>
                    </Menu.Header>
                    {grouped[item].map((i) => {
                        if (!properties.some((p) => p.propertyName === i.propertyName)) {
                            index = index + 1;
                            const item =
                                <MenuItem key={index} option={i} position={index} disabled={catSelected || selected.some(s => s.propertyName === i.propertyName)}>
                                    <Highlighter search={state.text}>
                                        {`- ${i.propertyName}`}
                                    </Highlighter>
                                </MenuItem>;
                            return item;
                        }
                        return null;
                    })}
                </Fragment>
            );
        });

        return <Menu {...menuProps}>{items}</Menu>;
    }, [properties, selected]);

    const token = (option, { onRemove }, index) => (
        <Token
            key={index}
            onRemove={onRemove}
            option={option}>
            {`${option.propertyName}`}
        </Token>
      );
    
    const select = (data) => {
        setSelected(data);
    };

    const add = (s) => {
        onAddProperties(s);
        setSelected([]);
    };

    return (
        <Fragment>
            <div className="flex-grow w-75">
                <label htmlFor="property-selector">Add properties</label>
                <Typeahead
                    id='property-selector'
                    onChange={selected => select(selected)}
                    options={options}
                    selected={selected}
                    labelKey={option => `${option.propertyName}`}
                    filterBy={['propertyName', 'category', 'displayType']}
                    renderMenu={ menu }
                    paginate={false}
                    multiple={ true }
                    maxResults={options.length}
                    renderToken={ token }>
                        {({ isMenuShown, toggleMenu }) => (
                            <ToggleButton isOpen={isMenuShown} onClick={e => toggleMenu()}>
                                <span className="sr-only">Options</span>
                            </ToggleButton>
                        )}
                </Typeahead>
            </div>
            <Button type="button"
                variant="success"
                className="ms-2"
                onClick={() => add(selected)}>Add</Button>
        </Fragment>
    )
}

export default PropertySelector;