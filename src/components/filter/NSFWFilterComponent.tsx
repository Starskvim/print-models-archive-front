import React from 'react';
import styled from "styled-components";

interface NSFWFilterProps {
    isEnabled: boolean;  // Новое имя пропса для лучшего понимания его функции
    onToggle: (enabled: boolean) => void;  // Функция для обработки изменения состояния
}

const NSFWFilterComponent: React.FC<NSFWFilterProps> = ({ isEnabled, onToggle }) => {
    return (
        <FilterStyled>
            <label className="nsfw-filter">
                <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) => onToggle(e.target.checked)}  // Обработка переключения состояния
                />
                Only NSFW
            </label>
        </FilterStyled>
    );
};

const FilterStyled = styled.section`
    .nsfw-filter {
        padding: 5px 10px;
        margin: 5px 0;
        background-color: ${({ theme }) => theme.colors.card_bg};
        color: ${({ theme }) => theme.colors.text};
        font-weight: bold;
        border: 1px solid ${({ theme }) => theme.colors.border};
        border-radius: 4px;
        padding: 8px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        font-size: 14px;
        cursor: pointer;
        
        input[type="checkbox"] {
            margin-right: 10px;
        }
    }
`;

export default NSFWFilterComponent;