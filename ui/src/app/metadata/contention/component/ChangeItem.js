import React from 'react';
import Translate from '../../../i18n/components/translate';

export const ValueTypes = {
    array: 'array',
    object: 'object',
    string: 'string',
    number: 'number',
    symbol: 'symbol',
    boolean: 'boolean',
    function: 'function',
    undefined: 'undefined'
}


function getType(value) {
    return Array.isArray(value) ? 'array' : typeof value;
}

function getValue(val, type) {
    switch (type) {
        case 'object': {
            return Object.keys(val).map(k => ({ label: k, value: val[k] }));
        }
        case 'array': {
            return parseArray(val);
        }
        default: {
            return val;
        }
    }
}

function parseArray(list) {
    switch (getType(list[0])) {
        case 'string': {
            return {
                type: 'string',
                values: list
            };
        }
        default: {
            return {
                type: 'object',
                headings: list.reduce((arr, o) => {
                    return Object.keys(o).reduce((a, k) => {
                        if (a.indexOf(k) === -1) { a.push(k); }
                        return a;
                    }, arr);
                }, []),
                values: list
            };
        }
    }
}

export function ChangeItem ({item}) {

    const isList = Array.isArray(item.value);

    const type = getType(item.value);
    const display = getValue(item.value, type);

    return (
        <React.Fragment>
        <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1"><Translate value={item.label}>{item.label}</Translate></h5>
            {item.conflict &&
                <small>
                    <i className="fa fa-exclamation-triangle text-danger" aria-hidden="true"></i>
                    <span className="sr-only"><Translate value="message.conflict">Conflict</Translate></span>
                </small>
            }
        </div>
        { type === ValueTypes.array ?
            <table className="table table-sm table-bordered">
                {display.type === ValueTypes.object &&
                    <React.Fragment>
                        <thead>
                            <tr>
                                {display.headings.map((heading, idx) =>
                                    <th>
                                        <Translate key={heading}>{heading}</Translate>
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {display.values.map((obj, oidx) => (
                                <tr key={oidx}>
                                    {display.headings.map((key, kidx) =>
                                        <td key={kidx}>{ obj[key] }</td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </React.Fragment>
                }
                { display.type === ValueTypes.string &&
                    <tbody>
                        {display.values.map((val, vidx) =>
                            <tr key={vidx}>
                                <td>{val}</td>
                            </tr>
                        )}
                        
                    </tbody>
                }
                
                
                
            </table>
        :
        type === ValueTypes.object ?
            <dl className="px-1">
                {display.map((item, iidx) =>
                    <React.Fragment key={iidx}>
                        <dt><Translate value={item.label}>{item.label}</Translate></dt>
                        <dd>{ item.value }</dd>
                    </React.Fragment>
                )}
            </dl>
        :
        <React.Fragment>
            {!isList && <p className="mb-1"><Translate value={display}></Translate></p>}
        </React.Fragment>
        }
        </React.Fragment>
        
    );
}