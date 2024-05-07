import React, {FC, useState} from 'react';
import CategoryItem from "./CategoryItemComponent";
import {Category} from "../../types/catalog/Catalog";
import styled from "styled-components";

interface DropdownMenuProps {
    categories: Category[];
}

const DropdownMenu: FC<DropdownMenuProps> = (
    {categories}
) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <Styled>
            <div className="dropdownMenu">
                <button onClick={toggleMenu}>Categories {isMenuOpen ? '▼' : '►'}</button>
                {isMenuOpen && (
                    <ul>
                        {categories.map(category => (
                            <CategoryItem key={category.name} category={category}/>
                        ))}
                    </ul>
                )}
            </div>
        </Styled>
    );
};

export default DropdownMenu;

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

    .dropdownMenu ul {
        //list-style: none;
        //padding: 0;
        //margin: 0;
        //position: absolute;
        //width: 100%; /* Ширина списка равна ширине кнопки */
        //background-color: white;
        //border: 1px solid #ccc;
        //border-radius: 5px;
        //box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Тень вокруг выпадающего списка */
        //max-height: 300px; /* Ограничиваем высоту и добавляем скролл */
        //overflow-y: auto;

        //list-style: none;
        //padding: 10px 0; /* Увеличенные верхний и нижний отступы */
        //margin: 0;
        //position: absolute;
        //width: 300px; /* Увеличенная ширина списка */
        //background-color: white;
        //border: 1px solid #ccc;
        //border-radius: 5px;
        //box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        //max-height: 800px; /* Увеличенная максимальная высота */
        //overflow-y: auto; /* Поддержка прокрутки, если содержимое превышает максимальную высоту */

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
        overflow-y: auto; /* Поддержка прокрутки */
    }
`;