import React, {FC, useEffect, useState} from 'react';
import CategoryItem from "./CategoryItemComponent";
import {Catalog, Category} from "../../types/catalog/Catalog";
import styled from "styled-components";
import {getCatalog} from "../../services/CatalogService";
import {useAppContext} from "../../state/AppContext";

interface DropdownMenuProps {

}

const CatalogDropdownMenu: FC<DropdownMenuProps> = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const {globalState, updateGlobalState} = useAppContext();

    useEffect(() => {
        const fetchCategories = async () => {
            const catalog: Catalog = await getCatalog();
            updateGlobalState({catalog: catalog.catalog, categories: catalog.categories})
        };
        fetchCategories();
    }, []);

    return (
        <Styled>
            <div className="dropdownMenu">
                <button onClick={toggleMenu}>Catalog {isMenuOpen ? '▼' : '►'}</button>
                {isMenuOpen && (
                    <div className="dropdownItem">
                        {globalState.categories.map(category => (
                            <CategoryItem key={category.name} category={category}/>
                        ))}
                    </div>
                )}
            </div>
        </Styled>
    );
};

export default CatalogDropdownMenu;

const Styled = styled.div`
    
    .dropdownMenu {
        margin-left: 10vmin;
        position: relative; /* Это позволяет абсолютно позиционировать выпадающий список внутри блока */
        z-index: 1000; /* Это значение z-index гарантирует, что меню будет наверху других элементов */
    }

    .dropdownMenu button {
        background-color: ${({ theme }) => theme.colors.helper};
        color: ${({ theme }) => theme.colors.white};
        padding: 10px 20px;
        font-size: 16px;
        border: none;
        cursor: pointer;
        border-radius: 5px; /* Скругленные углы */
        outline: none; /* Убрать контур при фокусе */
        transition: background-color 0.3s, box-shadow 0.3s; /* Плавные переходы для фона и тени */
    }

    .dropdownMenu button:hover, .dropdownMenu button:focus {
        background-color: ${({ theme }) => theme.colors.btn};
        box-shadow: ${({ theme }) => theme.colors.shadowSupport};
    }

    .dropdownMenu dropdownItem {

        list-style: none;
        padding: 5px 0; /* Возможно увеличение внутренних отступов */
        margin: 0;
        position: absolute;
        width: 300px; /* Ширина, адаптируйте по необходимости */
        background-color: ${({ theme }) => theme.colors.card_bg};
        border: 1px solid ${({ theme }) => theme.colors.border};
        border-radius: 5px;
        box-shadow: ${({ theme }) => theme.colors.shadowSupport};
        max-height: 600px;
        //overflow-y: auto; /* Поддержка прокрутки */
    }
`;