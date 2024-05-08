import React, { useState, FC } from 'react';
import {Category} from "../../types/catalog/Catalog";
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";

interface CategoryItemProps {
    category: Category;
}

interface StyledCategoryItemProps {
    level: number;
}

const CategoryItem: FC<CategoryItemProps> = ({ category }) => {

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const navigate = useNavigate();

    const handleCategoryClick = () => {
        navigate(`models/category/${category.name}`);
    };

    return (
        <StyledCategoryItem className={isOpen ? 'open' : ''} level={category.level} {...undefined}>
            <button className="category-button" onClick={toggle}>
                <span onClick={handleCategoryClick} className="category-link">
                    {category.name} - {category.size}
                </span>
                {category.children && <span>{isOpen ? '▼' : '►'}</span>}
            </button>
            {isOpen && category.children && (
                <div className="category-list">
                    {category.children.map(child => (
                        <CategoryItem key={child.name} category={{ ...child, level: category.level + 1 }} />
                    ))}
                </div>
            )}
        </StyledCategoryItem>
    );
};

const StyledCategoryItem = styled.li<StyledCategoryItemProps>`
    padding-left: ${props => props.level * 20}px; // Увеличиваем отступ на 20px за каждый уровень

    .category-button {
        background: none;
        border: none;
        text-align: left;
        width: 100%;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 16px;
        color: #333;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background-color 0.2s ease;

        &:hover {
            background-color: #f8f8f8;
        }
    }

    .category-link {
        flex-grow: 1;
        cursor: pointer;
        text-decoration: none;
        color: #0645ad;

        &:hover {
            text-decoration: underline;
        }
    }

    .category-list {
        list-style: none;
        padding-left: 20px;
        margin: 0;
        background-color: white;
        border-left: 1px solid #ccc;
        position: relative;
        max-height: 400px;
        overflow-y: auto;
    }

    &.open .category-list {
        display: block;
    }
`;

export default CategoryItem;