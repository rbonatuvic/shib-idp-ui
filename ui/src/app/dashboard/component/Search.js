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

    const handleSubmit = (evt) => {
        evt.preventDefault();
        search(query);
    }

    return (
        <>
            <Form className="w-50" noValidate onSubmit={(evt) => handleSubmit(evt)}>
                <Form.Group>
                    <Form.Label htmlFor="search" className="sr-only">Search</Form.Label>
                    <InputGroup>
                        <Form.Control type="text" name="search" id="search"
                            placeholder="Search Files"
                            onChange={ (event) => search(event.target.value) }
                            value={query} />
                        <InputGroup.Append>
                            <Button type="button" variant="outline-primary" className="px-3" onClick={ () => search('') }>Clear</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form.Group>
            </Form>
            { children(searched) }
        </>
    );
}