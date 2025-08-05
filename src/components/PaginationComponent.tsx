import {preparePages} from "../utils/paginate";
import React from "react";
import styled from "styled-components";
import { PageButtonStyled } from "./pagination/PageLinkStyled";

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
        <PaginationContainer>
            <PaginationList>
                {pages.map(page => (
                    page !== '...'
                        ? <PaginationItem key={page.toString()}>
                            <PageButtonStyled
                                active={page === currentPage}
                                onClick={() => onPageChange(Number(page))}
                            >
                                {page}
                            </PageButtonStyled>
                        </PaginationItem>
                        : <PaginationItem key={page + Math.random()}>
                            <PageButtonStyled
                                disabled
                                onClick={() => onPageChange(Number(page))}
                            >
                                {page}
                            </PageButtonStyled>
                        </PaginationItem>
                ))}
            </PaginationList>
        </PaginationContainer>
    );
};

const PaginationContainer = styled.nav`
    display: flex;
    justify-content: center;
    margin: 20px 0;
`;

const PaginationList = styled.ul`
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    padding: 0;
    margin: 0;
    width: fit-content;
`;

const PaginationItem = styled.li<{ children?: React.ReactNode }>`
    width: 50px;
    display: flex;
`;

export default PaginationComponent;