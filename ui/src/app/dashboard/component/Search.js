import React from 'react';
import pick from 'lodash/pick';

import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


import { includes, some, values } from 'lodash';

export function Search ({ entities, searchable, children }) {

    const [searched, setSearched] = React.useState([]);
    const [query, setQuery] = React.useState('');

    React.useEffect(() => setSearched(entities), [entities]);

    const search = (query) => {
        setQuery(query);
    };

    React.useEffect(() => {
        if (!query) {
            setSearched(entities);
        } else {
            setSearched(entities.filter((e) => {
                const picked = values(pick(e, searchable));
                return some(picked, (v) => includes(v.toLowerCase(), query.toLowerCase()));
            }));
        }
    }, [query, entities, searchable]);

    return (
        <>
            <Form className="w-50">
                <Form.Group>
                    <Form.Label for="search" className="sr-only">Search</Form.Label>
                    <InputGroup>
                        <Form.Control type="email" name="email" id="search"
                            placeholder="Search Files" onChange={ (event) => search(event.target.value) }
                            value={query} />
                        <InputGroup.Append>
                            <Button color="text" className="px-3" onClick={ () => search('') }>Clear</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form.Group>
            </Form>
            { children(searched) }
        </>
    );
}