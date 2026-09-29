import React from "react";
import {Category} from "../../types/catalog/Catalog";
import styled from "styled-components";

interface FilterSectionComponentProps {
    categories: Category[];
    selectedCategory: string;
    onCategoryChange: Function // More specific function type
}

const FilterSectionComponent: React.FC <FilterSectionComponentProps> = (
    {
        categories,
        selectedCategory,
        onCategoryChange
    }
) => {

    return (
        <StyledSection>
            <div className="filter-category">
                <h3>Categories</h3>
                <div className="category-list">
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            type="button"
                            name="category"
                            value={category.name}
                            className={selectedCategory === category.name ? "active" : ""}
                            aria-pressed={selectedCategory === category.name}
                            onClick={onCategoryChange(category.name)}
                            title={`${category.name} (${category.size} items)`}
                        >
                            <span className="category-name">{category.name}</span>
                            <span className="category-size">{category.size}</span>
                        </button>
                    ))}
                </div>
            </div>
        </StyledSection>
    )
}

export default FilterSectionComponent

const StyledSection = styled.section`
  position: sticky;
  top: 20px;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 40px);
  min-width: 0;

  h3 {
    padding: 1rem 0;
    font-size: bold;
    flex-shrink: 0;
  }

  .filter-category {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .category-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    min-height: 0;
    overflow-y: auto;
    padding-right: 0.5rem;

    /* Custom scrollbar styling */
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.btn} transparent;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.btn};
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.border};
    }

    button {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      flex-shrink: 0;
      border: 1px solid transparent;
      background-color: transparent;
      color: ${({ theme }) => theme.colors.text};
      text-transform: capitalize;
      cursor: pointer;
      width: 100%;
      text-align: left;
      padding: 0.8rem 1.2rem;
      border-radius: 0.4rem;
      transition: all 0.3s ease;

      &:hover {
        background-color: ${({ theme }) => theme.colors.hr};
        color: ${({ theme }) => theme.colors.btn};
      }
    }

    .category-name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .category-size {
      flex-shrink: 0;
      opacity: 0.7;
    }

    .active {
      background-color: ${({ theme }) => theme.colors.btn};
      color: ${({ theme }) => theme.colors.white};
      border-color: ${({ theme }) => theme.colors.btn};
    }
  }

  .btnStyle {
    width: 2rem;
    height: 2rem;
    background-color: ${({ theme }) => theme.colors.text};
    border-radius: 50%;
    margin-left: 1rem;
    border: none;
    outline: none;
    opacity: 0.5;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  }

  .active {
    opacity: 1;
  }

  .checkStyle {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.white};
  }

  .filter-clear .btn {
    background-color: ${({ theme }) => theme.colors.helper};
    color: ${({ theme }) => theme.colors.white};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.btn};
    }
  }
`;