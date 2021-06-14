import React from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';

const PAGE_LIMIT = 20;

export function Scroller ({ entities, children }) {

    const [page, setPage] = React.useState(1);

    const [limited, setLimited] = React.useState([]);

    React.useEffect(() => {
        let maxIndex = (page * PAGE_LIMIT) - 1,
            minIndex = 0;
        const l = entities.filter((resolver, index) => (maxIndex >= index && index >= minIndex));
        setLimited(l);
    }, [entities, page])

    const loadNext = () => {
        setPage(page + 1);
    }

    return (
        <InfiniteScroll
            dataLength={limited.length} //This is important field to render the next data
            next={() => loadNext()}
            hasMore={entities.length > limited.length}
        >
            { children(limited) }
        </InfiniteScroll>
    );
}