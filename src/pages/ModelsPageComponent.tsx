import React, {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import {fetchModelCards} from "../services/ProductService";
import PrintModelCardsComponent from "../components/card/PrintModelCardsComponent";
import {PAGE_SIZE} from "../configuration/Config";
import {useAppContext} from "../state/AppContext";
import FilterSectionComponent from "../components/filter/FilterSectionComponent";
import styled from "styled-components";

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
        globalState.nsfwOnly,
        globalState.selectedCategory
    ]); // hook on state

    const updateModelCards = async () => {
        ///
        let categoryForQuery
        if (categoryName !== 'all' && categoryName !== undefined) {
            categoryForQuery = categoryName
        } else {
            categoryForQuery = globalState.selectedCategory
        }
        console.log("categoryForQuery " + categoryForQuery)
        ///
        const response = await fetchModelCards(
            globalState.currentPage,
            PAGE_SIZE,
            undefined,
            globalState.searchQuery,
            categoryForQuery,
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

    const handleCategoryChange = (category: string) => () => {
        console.log("handleCategoryChange - " + category);
        updateGlobalState({currentPage: 1, selectedCategory: category});
    }

    return (
        <Styled>
            <div className="container grid grid-filter-column">
                    <FilterSectionComponent
                        categories={globalState.categories}
                        selectedCategory={globalState.selectedCategory}
                        onCategoryChange={handleCategoryChange}
                    />
                    <PrintModelCardsComponent
                        products={globalState.products}
                        size={globalState.size}
                        currentPage={globalState.currentPage}
                        onPageChange={handlePageClick}
                    />
            </div>
        </Styled>
    );
};

const Styled = styled.section`
    .grid-filter-column {
        //grid-template-columns: 0.1fr 1fr;
        display: grid;
        grid-template-columns: 100px 1fr; // Фиксированная ширина для фильтра и оставшееся пространство для карточек
        gap: 20px; // Добавляем немного пространства между колонками
        padding: 20px; // Общий отступ для секции
        height: 100%; // Занимает полную доступную высоту
        
    }


    @media (max-width: ${({theme}) => theme.media.mobile}) {
        .grid-filter-column {
            grid-template-columns: 1fr; // Всё пространство для мобильных устройств
            gap: 10px; // Меньше пространства между компонентами на мобильных
        }
    }
`;

export default ModelsPageComponent;