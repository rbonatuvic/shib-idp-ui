import React from 'react';
import { format } from 'date-fns';

export default function FormattedDate ({ date, time = false }) {
    const formatted = React.useMemo(() => format(new Date(date), `MMM Lo, Y${time ? ' HH:mm:ss' : ''}`), [date, time]);

    return (<>{ formatted }</>);
}