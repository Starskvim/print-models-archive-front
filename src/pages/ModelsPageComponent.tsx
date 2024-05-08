import React, {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import {fetchModelCards} from "../services/ProductService";
import PrintModelCardsComponent from "../components/card/PrintModelCardsComponent";
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
        globalState.searchQuery,
        globalState.nsfwOnly
    ]); // hook on state

    const updateModelCards = async () => {
        const response = await fetchModelCards(
            globalState.currentPage,
            PAGE_SIZE,
            undefined,
            globalState.searchQuery,
            categoryName,
            globalState.rate,
            globalState.nsfwOnly
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

    return (
        <div className="container">
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