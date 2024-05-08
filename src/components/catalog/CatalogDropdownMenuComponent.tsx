import React, {FC, useEffect, useState} from 'react';
import CategoryItem from "./CategoryItemComponent";
import {Catalog, Category} from "../../types/catalog/Catalog";
import styled from "styled-components";
import {getCatalog} from "../../services/CatalogService";

interface DropdownMenuProps {

}

const CatalogDropdownMenu: FC<DropdownMenuProps> = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const [catalog, setCatalog] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const catalog: Catalog = await getCatalog();
            setCatalog(catalog.catalog);
        };
        fetchCategories();
    }, []);

    return (
        <Styled>
            <div className="dropdownMenu">
                <button onClick={toggleMenu}>Catalog {isMenuOpen ? '▼' : '►'}</button>
                {isMenuOpen && (
                    <div className="dropdownItem">
                        {catalog.map(category => (
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
        position: relative; /* Это позволяет абсолютно позиционировать выпадающий список внутри блока */
        z-index: 1000; /* Это значение z-index гарантирует, что меню будет наверху других элементов */
    }

    .dropdownMenu button {
        background-color: #4CAF50; /* Зеленый фон */
        color: white; /* Белый текст */
        padding: 10px 20px;
        font-size: 16px;
        border: none;
        cursor: pointer;
        border-radius: 5px; /* Скругленные углы */
        outline: none; /* Убрать контур при фокусе */
        transition: background-color 0.3s, box-shadow 0.3s; /* Плавные переходы для фона и тени */
    }

    .dropdownMenu button:hover, .dropdownMenu button:focus {
        background-color: #3E8E41; /* Темно-зеленый фон при наведении */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Тень для 3D эффекта */
    }

    .dropdownMenu dropdownItem {

        list-style: none;
        padding: 5px 0; /* Возможно увеличение внутренних отступов */
        margin: 0;
        position: absolute;
        width: 300px; /* Ширина, адаптируйте по необходимости */
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        max-height: 600px; /* Увеличенная максимальная высота */
        //overflow-y: auto; /* Поддержка прокрутки */
    }
`;