import {preparePages} from "../utils/paginate";
import React from "react";


interface PaginationComponentProps {
    itemsCount: number;
    maxItemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = (
    {
        itemsCount,
        maxItemsPerPage,
        currentPage,
        onPageChange
    }
) => {
    const pagesCount = Math.ceil(itemsCount / maxItemsPerPage);
    if (pagesCount === 1) return null;
    const pages = preparePages(currentPage, pagesCount);

    return (
        <nav>
            <ul className="pagination mx-auto" style={{width: 'fit-content'}}>
                {pages.map(page => (
                    page !== '...'
                        ? <li key={page.toString()} className={page === currentPage ? "page-item active" : "page-item"}
                              style={{width: '50px'}}>
                            <button className="page-link" style={{textAlign: 'center'}} onClick={() => onPageChange(Number(page))}>
                                {page}
                            </button>
                        </li>
                        : <li key={page + Math.random()} className="page-item disabled" style={{width: '50px'}}>
                            <button className="page-link" style={{textAlign: 'center'}} disabled onClick={() => onPageChange(Number(page))}>
                                {page}
                            </button>
                        </li>
                ))}
            </ul>
        </nav>
    );
};

export default PaginationComponent;