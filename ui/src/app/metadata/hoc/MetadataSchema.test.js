import React from "react";
import ReactDOM from 'react-dom';
import { render, screen } from "@testing-library/react";
import { act } from 'react-dom/test-utils';
import { MetadataSchema, useMetadataDefinitionContext } from './MetadataSchema';

let container;
beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

const Tester = () => {
    const definition = useMetadataDefinitionContext();

    return (
        <>
            <>{definition.type}</>
        </>
    );
}


xdescribe("<MetadataSchema />", () => {
    /*xact(() => {
        ReactDOM.render(
            <MetadataSchema type="source">
                <Tester></Tester>
            </MetadataSchema>,
            container
        );
    });*/

    xdescribe("definition context", () => {
        it("should provide the type of the definition", () => {
            expect(screen.getByText('@MetadataProvider')).toBeTruthy();
        });
    });
});