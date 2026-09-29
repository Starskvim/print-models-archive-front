import React from 'react';
import styled from "styled-components";
import {filterControlCss} from "./FilterControl";

interface NSFWFilterProps {
    isEnabled: boolean;
    onToggle: (enabled: boolean) => void;
}

const NSFWFilterComponent: React.FC<NSFWFilterProps> = ({isEnabled, onToggle}) => (
    <ToggleStyled
        type="button"
        aria-pressed={isEnabled}
        className={isEnabled ? 'active' : ''}
        onClick={() => onToggle(!isEnabled)}
    >
        Only NSFW
    </ToggleStyled>
);

interface ToggleStyledProps {
    type: 'button';
    'aria-pressed': boolean;
    className: string;
    onClick: () => void;
    children: React.ReactNode;
}

const ToggleStyled = styled.button<ToggleStyledProps>`
    ${filterControlCss}
`;

export default NSFWFilterComponent;
