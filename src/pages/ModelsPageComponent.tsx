import React, {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import {fetchModelCards} from "../services/ProductService";
import SearchBox from "../components/SearchBox";
import PrintModelCardsComponent from "../components/card/PrintModelCardsComponent";
import RateFilterComponent from "../components/RateFilterComponent";
import {PAGE_SIZE} from "../configuration/Config";
import {useAppContext} from "../state/AppContext";

interface ModelsPageProps {
    categoryName?: string;
}

const ModelsPageComponent: React.FC<ModelsPageProps> = ({}) => {

    const { categoryName } = useParams<{ categoryName?: string }>();

    const {globalState, updateGlobalState} = useAppContext();

    useEffect(() => {
        updateModelCards();
        window.scrollTo(0, 0);
    }, [
        categoryName,
        globalState.currentPage,
        globalState.rate,
        globalState.searchQuery
    ]); // hook on state

    const updateModelCards = async () => {
        const response = await fetchModelCards(
            globalState.currentPage,
            PAGE_SIZE,
            undefined,
            globalState.searchQuery,
            categoryName,
            globalState.rate
        );
        updateGlobalState(
            {
                products: response.models,
                size: response.totalElements,
                totalPages: response.totalPages
            },
        );
    };


    const handlePageClick = (target: number) => {
        updateGlobalState({currentPage: target});
    };

    const handleRateFilter = (rate: string) => {
        updateGlobalState({rate: rate})
    };

    const handleSearch = (query: string) => {
        updateGlobalState({currentPage: 1, searchQuery: query})
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <SearchBox value={globalState.searchQuery} onChange={handleSearch}/>
                </div>
                <RateFilterComponent
                    rate={globalState.rate}
                    onChange={handleRateFilter}
                />
            </div>
            <PrintModelCardsComponent
                products={globalState.products}
                size={globalState.size}
                currentPage={globalState.currentPage}
                onPageChange={handlePageClick}
            />
        </div>
    );
};

export default ModelsPageComponent;