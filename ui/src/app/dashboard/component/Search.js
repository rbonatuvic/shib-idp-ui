import React from 'react';
import pick from 'lodash/pick';

import { Form, Label, Input, Button, InputGroup, InputGroupAddon, FormGroup} from 'reactstrap';
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
                <FormGroup>
                    <Label for="search" className="sr-only">Search</Label>
                    <InputGroup>
                        <Input type="email" name="email" id="search"
                            placeholder="Search Files" onChange={ (event) => search(event.target.value) }
                            value={query} />
                        <InputGroupAddon addonType="append">
                            <Button color="text" className="px-3" onClick={ () => search('') }>Clear</Button>
                        </InputGroupAddon>
                    </InputGroup>
                </FormGroup>
            </Form>
            { children(searched) }
        </>
    );
}