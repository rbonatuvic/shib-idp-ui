import React, { Fragment, useCallback } from 'react';
import { groupBy } from 'lodash';
import { Highlighter, Menu, MenuItem, Token, Typeahead } from 'react-bootstrap-typeahead';
import Button from 'react-bootstrap/Button';

import { ToggleButton } from '../../form/component/ToggleButton';

export function PropertySelector ({ properties, options, onAddProperties }) {

    // React.useEffect(() => console.log(properties), [properties]);

    const menu = useCallback((results, menuProps, state) => {
        let index = 0;
        const mapped = results.map(p => !p.category || p.category === '?' ? { ...p, category: 'Misc' } : p);
        const grouped = groupBy(mapped, 'category');
        const items = Object.keys(grouped).sort().map((item) => (
            <Fragment key={item}>
                {index !== 0 && <Menu.Divider />}
                <Menu.Header>
                    <MenuItem key={index}
                        option={{category: item, propertyName: item, isCategory: true}}
                        position={index}>
                            {item} - Add all
                    </MenuItem>
                </Menu.Header>
                {grouped[item].map((i) => {
                    const item =
                        <MenuItem key={index} option={i} position={index} disabled={ properties.some((p) => p.propertyName === i.propertyName) }>
                            <Highlighter search={state.text}>
                                {`- ${i.propertyName}`}
                            </Highlighter>
                        </MenuItem>;
                    index += 1;
                    return item;
                })}
            </Fragment>
        ));

        return <Menu {...menuProps}>{items}</Menu>;
    }, [properties]);

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

    const [selected, setSelected] = React.useState([]);

    const add = (s) => {
        onAddProperties(s);
        setSelected([]);
    }

    return (
        <Fragment>
            <div className="flex-grow w-75">
                <label htmlFor="property-selector">Add properties</label>
                <Typeahead
                    id='property-selector'
                    onChange={selected => select(selected)}
                    options={[...options]}
                    selected={selected}
                    labelKey={option => `${option.propertyName}`}
                    filterBy={['propertyName', 'category', 'displayType']}
                    renderMenu={ menu }
                    multiple={ true }
                    renderToken={ token }
                    >
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