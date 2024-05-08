// import { getPaginationItems } from '../lib/pagination';
import PageLink from './PageLink';
import './Pagination.css';
import {getPaginationItems} from "../../utils/pagination";

export type Props = {
    currentPage: number;
    lastPage: number;
    maxLength: number;
    setCurrentPage: (page: number) => void;
};

export default function PaginationComponent({
                                       currentPage,
                                       lastPage,
                                       maxLength,
                                       setCurrentPage,
                                   }: Props) {
    const pageNums = getPaginationItems(currentPage, lastPage, maxLength);

    return (
        <nav className="pagination" aria-label="PaginationComponent">
            <PageLink
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
            >
                Previous
            </PageLink>
            {pageNums.map((pageNum, idx) => (
                <PageLink
                    key={idx}
                    active={currentPage === pageNum}
                    disabled={isNaN(pageNum)}
                    onClick={() => setCurrentPage(pageNum)}
                >
                    {!isNaN(pageNum) ? pageNum : '...'}
                </PageLink>
            ))}
            <PageLink
                disabled={currentPage === lastPage}
                onClick={() => setCurrentPage(currentPage + 1)}
            >
                Next
            </PageLink>
        </nav>
    );
}