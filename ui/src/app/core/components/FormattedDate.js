import React from 'react';
import { format, parseISO } from 'date-fns';

export default function FormattedDate ({ date, time = false }) {
    const formatted = React.useMemo(() => format(parseISO(date), `MMM d, Y${time ? ' HH:mm:ss' : ''}`), [date, time]);

    return (<>{ formatted }</>);
}