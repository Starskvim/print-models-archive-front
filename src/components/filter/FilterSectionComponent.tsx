import React from "react";
import {Category} from "../../types/catalog/Catalog";
import styled from "styled-components";
import {truncateString} from "../../utils/StringUtils";

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
                <div>
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            type="button"
                            name="category"
                            value={category.name}
                            className={selectedCategory === category.name ? "active" : ""}
                            onClick={onCategoryChange(category.name)}
                        >
                            {truncateString(category.name, 6)} - {category.size}
                        </button>
                    ))}
                </div>
            </div>
        </StyledSection>
    )
}

export default FilterSectionComponent

const StyledSection = styled.section`
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  text-overflow: ellipsis;

  h3 {
    padding: 2rem 0;
    font-size: bold;
  }

  .filter-category {
    div {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1.4rem;

      button {
        border: none;
        background-color: ${({ theme }) => theme.colors.white};
        text-transform: capitalize;
        cursor: pointer;

        &:hover {
          color: ${({ theme }) => theme.colors.btn};
        }
      }

      .active {
        border-bottom: 1px solid #000;
        color: ${({ theme }) => theme.colors.btn};
      }
    }
  }
    
  .btnStyle {
    width: 2rem;
    height: 2rem;
    background-color: #000;
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
    color: #fff;
  }

  .filter-clear .btn {
    background-color: #ec7063;
    color: #000;
  }
`;