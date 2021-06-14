import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

import { DeleteConfirmation } from './DeleteConfirmation';

jest.mock('../../i18n/components/translate', () => {
    return 'span';
})

const noop = jest.fn();

let container;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

test('Delete confirmation', () => {
    act(() => {
        ReactDOM.render(
            <DeleteConfirmation title={`message.delete-filter-title`} body={`message.delete-filter-body`}>
                {(block) => <button onClick={() => block(() => noop())}></button>}
            </DeleteConfirmation>,
        container);
    });

    const initiator = container.querySelector('button');

    act(() => {
        initiator.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    let modal = container.querySelector('.modal');
    const confirm = container.querySelector('.btn-danger');

    expect(modal).toBeDefined();
    expect(confirm).toBeDefined();

});