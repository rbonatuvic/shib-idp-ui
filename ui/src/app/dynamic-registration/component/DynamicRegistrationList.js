import React from 'react';

export function DynamicRegistrationList ({entities}) {
    return <><pre>{JSON.stringify(entities, null, 4)}</pre></>
}