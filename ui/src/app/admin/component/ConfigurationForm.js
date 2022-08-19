import React, { Fragment } from 'react';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faSave } from '@fortawesome/free-solid-svg-icons';
import { Highlighter, Menu, MenuItem, Token, Typeahead } from 'react-bootstrap-typeahead';
import Translate from '../../i18n/components/translate';
import { ToggleButton } from '../../form/component/ToggleButton';

import { useProperties, usePropertiesLoading } from '../hoc/PropertiesProvider';
import { groupBy } from 'lodash';
import { useCallback } from 'react';

export function ConfigurationForm({ configuration = {}, errors = [], schema, onSave, onCancel }) {

    const properties = useProperties();
    const loading = usePropertiesLoading();

    const select = (data) => {
        console.log(data);
        setSelected(data);
    };

    const [selected, setSelected] = React.useState([]);

    const [config, setConfig] = React.useState({ name: '', properties: [] });

    // config.properties.filter(p => p.category === item.category).length === properties.filter(p => p.category === item.category).length

    const menu = useCallback((results, menuProps, state) => {
        let index = 0;
        const mapped = results.map(p => !p.category || p.category === '?' ? { ...p, category: 'Misc' } : p);
        const grouped = groupBy(mapped, 'category');
        const items = Object.keys(grouped).sort().map((item) => (
            <Fragment key={item}>
                {index !== 0 && <Menu.Divider />}
                <Menu.Header className="p-0">
                    <MenuItem key={index}
                        option={{category: item, propertyName: item, isCategory: true}}
                        position={index}>
                            {item} - Add all
                    </MenuItem>
                </Menu.Header>
                {grouped[item].map((i) => {
                    const item =
                        <MenuItem key={index} option={i} position={index} disabled={ config.properties.some((p) => p.propertyName === i.propertyName) }>
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
    }, [config.properties]);

    const token = (option, { onRemove }, index) => (
        <Token
            key={index}
            onRemove={onRemove}
            option={option}>
            {`${option.propertyName}`}
        </Token>
      );

    const addProperties = (props) => {

        const parsed = props.reduce((coll, prop, idx) => {
            if (prop.isCategory) {
                return [...coll, ...properties.filter(p => p.category === prop.category)];
            } else {
                return [...coll, prop];
            }
        }, []);

        setConfig({
            ...config,
            properties: [
                ...config.properties,
                ...parsed,
            ]
        });
        setSelected([]);
    };

    React.useEffect(() => console.log(selected), [selected]);

    return (<>
        <div className="container-fluid">
            <div className="d-flex justify-content-end align-items-center">
                <React.Fragment>
                    <Button variant="info" className="me-2"
                        type="button"
                        onClick={() => onSave(configuration)}
                        disabled={errors.length > 0 || loading}
                        aria-label="Save changes to the metadata source. You will return to the dashboard">
                        <FontAwesomeIcon icon={loading ? faSpinner : faSave} pulse={loading} />&nbsp;
                        <Translate value="action.save">Save</Translate>
                    </Button>
                    <Button variant="secondary"
                        type="button"
                        onClick={() => onCancel()} aria-label="Cancel changes, go back to dashboard">
                        <Translate value="action.cancel">Cancel</Translate>
                    </Button>
                </React.Fragment>
            </div>
            <hr />
            <div className="row">
                <div className="col-12 col-lg-6 order-2">
                    <div className="d-flex align-items-end">
                        <div className="flex-grow w-75">
                            <label htmlFor="property-selector">Add properties</label>
                            <Typeahead
                                id='property-selector'
                                onChange={selected => select(selected)}
                                options={[...properties]}
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
                            variant="outline-secondary"
                            className="ms-2"
                            onClick={() => addProperties(selected)}>Add</Button>
                    </div>
                </div>
            </div>
            <div className="my-4"></div>
            <div className='row'>
                <div className='col-12'>
                    <table className='w-100 table'>
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Category</th>
                                <th>Type</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {config.properties.map((p, idx) => (
                                <tr key={idx}>
                                    <td>{ p.propertyName }</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>)
}
/**/