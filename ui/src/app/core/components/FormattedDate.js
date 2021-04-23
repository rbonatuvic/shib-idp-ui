import React from 'react';
import { format } from 'date-fns';

export default function FormattedDate ({ date }) {
    const formatted = React.useMemo(() => format(new Date(date), 'MMM Lo, Y'), [date]);

    return (<>{ formatted }</>);
}