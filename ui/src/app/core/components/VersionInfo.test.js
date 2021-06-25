import React from 'react';

import { render, screen } from '@testing-library/react';

import { VersionInfo } from './VersionInfo';

const data = { "git": { "branch": "react", "commit": { "id": "634f1a4", "time": "2021-06-10T19:00:29Z" } }, "build": { "artifact": "shibui", "name": "backend", "time": "2021-06-10T19:26:14.478Z", "version": "2.0.0-SNAPSHOT", "group": "edu.internet2.tier.shibboleth.admin.ui" } };

jest.mock('../../i18n/components/translate', () => {
    return 'span';
})

jest.mock('use-http', () => {
    return () => ({ data });
});

it('should display formatted version information', () => {

    render(<VersionInfo />);
    expect(screen.getByText('2.0.0-SNAPSHOT-634f1a4', { exact: false })).toBeInTheDocument();
});