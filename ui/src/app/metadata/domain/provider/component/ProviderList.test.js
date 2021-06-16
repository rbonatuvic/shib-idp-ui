import React from 'react';
import { render, screen } from '@testing-library/react';
import { fc } from 'jest-fast-check';

import { ProviderList } from './ProviderList';

jest.mock('../../../../i18n/hooks', () => ({
    useTranslation: (value) => value
}));

jest.mock('../../../../dashboard/component/Scroller', () => ({
    Scroller: ({ children, entities }) => <div>{children(entities)}</div>
}));

jest.mock('../../../../core/components/FormattedDate', () => ({
    FormattedDate: ({date, time}) => (<>{date}</>)
}));

jest.mock('react-router-dom', () => ({
    Link: ({children, to}) => (<a href={to}>{children}</a>)
}));

xtest('Provider list', () => {
    const resourceId = 'foo';
    const entities = [{
        resourceId,
        name: 'foo',
        '@type': 'foo',
        createdBy: 'foo',
        createdDate: 'foo',
        enabled: 'foo'
    }];

    render(<ProviderList entities={entities} first={resourceId} last={resourceId} onOrderDown={jest.fn()} onOrderUp={jest.fn()} />);

    expect(screen.getByText('label.order')).toBeInTheDocument();
});