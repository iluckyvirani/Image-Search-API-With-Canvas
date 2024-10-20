import React from 'react';
import { Pagination } from 'react-bootstrap';

const CustomPagination = ({ page, totalPages, onPageChange }) => {
    const maxPagesToShow = 5;
    let items = [];

    let startPage = Math.max(page - 2, 1);
    let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(endPage - maxPagesToShow + 1, 1);
    }

    items.push(
        <Pagination.First key="first" onClick={() => onPageChange(1)} disabled={page === 1} />
    );
    items.push(
        <Pagination.Prev key="prev" onClick={() => onPageChange(page - 1)} disabled={page === 1} />
    );

    if (startPage > 1) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" />);
    }

    for (let i = startPage; i <= endPage; i++) {
        items.push(
            <Pagination.Item
                key={i}
                active={i === page}
                onClick={() => onPageChange(i)}
            >
                {i}
            </Pagination.Item>
        );
    }
    if (endPage < totalPages) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" />);
        items.push(
            <Pagination.Item
                key={totalPages}
                onClick={() => onPageChange(totalPages)}
            >
                {totalPages}
            </Pagination.Item>
        );
    }
    items.push(
        <Pagination.Next key="next" onClick={() => onPageChange(page + 1)} disabled={page === totalPages} />
    );
    items.push(
        <Pagination.Last key="last" onClick={() => onPageChange(totalPages)} disabled={page === totalPages} />
    );

    return (
        <Pagination className="search-pagination">
            {items}
        </Pagination>
    );
};

export default CustomPagination;
