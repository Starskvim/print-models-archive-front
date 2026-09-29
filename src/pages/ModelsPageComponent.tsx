import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import {fetchModelCards} from "../services/ProductService";
import PrintModelCardsComponent from "../components/card/PrintModelCardsComponent";
import SkeletonCard from "../components/card/SkeletonCard";
import ErrorBlock from "../components/ErrorBlock";
import {PAGE_SIZE} from "../configuration/Config";
import {useAppContext} from "../state/AppContext";
import FilterSectionComponent from "../components/filter/FilterSectionComponent";
import styled from "styled-components";

type LoadStatus = 'loading' | 'error' | 'ready';

const ModelsPageComponent: React.FC = () => {

    const { categoryName } = useParams<{ categoryName?: string }>();
    const navigate = useNavigate();

    const {globalState, updateGlobalState} = useAppContext();

    const [status, setStatus] = useState<LoadStatus>('loading');
    const [retryTick, setRetryTick] = useState(0);

    const urlCategory = categoryName !== undefined && categoryName !== 'all' ? categoryName : undefined;
    const activeCategory = urlCategory ?? globalState.selectedCategory;

    useEffect(() => {
        let cancelled = false;
        setStatus('loading');
        window.scrollTo(0, 0);

        fetchModelCards(
            globalState.currentPage,
            PAGE_SIZE,
            undefined,
            globalState.searchQuery,
            activeCategory,
            globalState.rate,
            globalState.nsfwOnly
        )
            .then(response => {
                if (cancelled) return;
                updateGlobalState(
                    {
                        products: response.models ? response.models : [],
                        size: response.totalElements,
                        totalPages: response.totalPages
                    },
                );
                setStatus('ready');
            })
            .catch(() => {
                if (cancelled) return;
                setStatus('error');
            });

        return () => {
            cancelled = true;
        };
    }, [
        categoryName,
        globalState.currentPage,
        globalState.rate,
        globalState.searchQuery,
        globalState.nsfwOnly,
        globalState.selectedCategory,
        retryTick
    ]); // hook on state

    const handlePageClick = (target: number) => {
        updateGlobalState({currentPage: target});
    };

    // Clicking the selected category again switches it off. A category URL
    // (/models/category/:name) is left for /models once the sidebar takes over.
    const handleCategoryChange = (category: string) => () => {
        const next = category === activeCategory ? 'all' : category;
        updateGlobalState({currentPage: 1, selectedCategory: next});
        if (urlCategory !== undefined) {
            navigate('/models');
        }
    }

    return (
        <Styled>
            <div className="container grid grid-filter-column">
                    <FilterSectionComponent
                        categories={globalState.categories}
                        selectedCategory={activeCategory}
                        onCategoryChange={handleCategoryChange}
                    />
                    {status === 'loading' && (
                        <div className="row">
                            {Array.from({length: Number(PAGE_SIZE)}).map((_, index) => (
                                <div className="col my-3" key={index}>
                                    <SkeletonCard/>
                                </div>
                            ))}
                        </div>
                    )}
                    {status === 'error' && (
                        <ErrorBlock>
                            <p>Failed to load models</p>
                            <button onClick={() => setRetryTick(tick => tick + 1)}>
                                Try again
                            </button>
                        </ErrorBlock>
                    )}
                    {status === 'ready' && globalState.products.length === 0 && (
                        <EmptyBlock>No models found</EmptyBlock>
                    )}
                    {status === 'ready' && globalState.products.length > 0 && (
                        <PrintModelCardsComponent
                            products={globalState.products}
                            size={globalState.size}
                            currentPage={globalState.currentPage}
                            onPageChange={handlePageClick}
                        />
                    )}
            </div>
        </Styled>
    );
};

const Styled = styled.section`
    .grid-filter-column {
        display: grid;
        grid-template-columns: 180px 1fr;
        gap: 20px;
        padding: 20px;
        align-items: start;
    }

    @media (max-width: ${({theme}) => theme.media.mobile}) {
        .grid-filter-column {
            grid-template-columns: 1fr;
            gap: 10px;
        }
    }
`;

const EmptyBlock = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: ${({theme}) => theme.colors.text};
    font-size: 18px;
`;

export default ModelsPageComponent;
