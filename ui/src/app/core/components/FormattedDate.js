import React from 'react';
import { format, parseISO } from 'date-fns';

export function useDateFormatter() {
    return (date, time) => format(parseISO(date), `MMM d, Y${time ? ' HH:mm:ss' : ''}`);
}

export function useFormattedDate (date, time = false) {
    const formatter = useDateFormatter();
    return React.useMemo(() => formatter(date, time), [date, time, formatter]);
}

export function FormattedDate ({ date, time = false }) {
    const formatted = useFormattedDate(date, time);

    return (<>{ formatted }</>);
}

export default FormattedDate;