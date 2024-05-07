import React, { useState, FC } from 'react';
import {Category} from "../../types/catalog/Catalog";
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";

interface CategoryItemProps {
    category: Category;
}

const CategoryItem: FC<CategoryItemProps> = ({ category }) => {

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const navigate = useNavigate();

    const handleCategoryClick = () => {
        navigate(`models/category/${category.name}`);
    };

    return (
        <Styled>
            <li className="category-item">
                <button onClick={toggle} className="category-button">
                <span onClick={handleCategoryClick} className="category-link">
                    {category.name} - {category.size}
                </span>
                    {category.children && <span>{isOpen ? '▼' : '►'}</span>}
                </button>
                {isOpen && category.children && (
                    <ul className="category-list">
                        {category.children.map(child => (
                            <CategoryItem key={child.name} category={child}/>
                        ))}
                    </ul>
                )}
            </li>
        </Styled>
    );
};

const Styled = styled.section`

    .category-list ul {
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

export default CategoryItem;