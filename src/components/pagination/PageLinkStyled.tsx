import styled from 'styled-components';

export const PageLinkStyled = styled.a<{ active?: boolean; disabled?: boolean }>`
    position: relative;
    display: inline-flex;
    border: 1px solid ${({theme}) => theme.colors.border};
    background-color: ${({theme}) => theme.colors.card_bg};
    padding: 10px 15px;
    color: ${({theme}) => theme.colors.helper};
    font-size: 16px;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
        border-color 0.15s ease-in-out;
    cursor: pointer;

    &:first-child {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }

    &:last-child {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    &:not(:first-child) {
        margin-left: -1px;
    }

    &:hover,
    &:focus {
        color: ${({theme}) => theme.colors.btn};
        background-color: ${({theme}) => theme.colors.bg};
        border-color: ${({theme}) => theme.colors.border};
    }

    &:focus {
        z-index: 3;
        box-shadow: 0 0 0 2px ${({theme}) => theme.colors.border};
    }

    ${({active, theme}) => active && `
        z-index: 2;
        color: ${theme.colors.white};
        border-color: ${theme.colors.helper};
        background-color: ${theme.colors.helper};
    `}

    ${({disabled, theme}) => disabled && `
        color: ${theme.colors.text};
        opacity: 0.5;
        pointer-events: none;
        cursor: not-allowed;
    `}
`;

export const PageButtonStyled = styled.button<{
    active?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
}>`
    position: relative;
    display: inline-flex;
    border: 1px solid ${({theme}) => theme.colors.border};
    background-color: ${({theme}) => theme.colors.card_bg};
    padding: 10px 15px;
    color: ${({theme}) => theme.colors.helper};
    font-size: 16px;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
        border-color 0.15s ease-in-out;
    cursor: pointer;
    text-align: center;

    &:first-child {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }

    &:last-child {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    &:not(:first-child) {
        margin-left: -1px;
    }

    &:hover:not(:disabled),
    &:focus:not(:disabled) {
        color: ${({theme}) => theme.colors.btn};
        background-color: ${({theme}) => theme.colors.bg};
        border-color: ${({theme}) => theme.colors.border};
    }

    &:focus {
        z-index: 3;
        box-shadow: 0 0 0 2px ${({theme}) => theme.colors.border};
        outline: none;
    }

    ${({active, theme}) => active && `
        z-index: 2;
        color: ${theme.colors.white};
        border-color: ${theme.colors.helper};
        background-color: ${theme.colors.helper};
    `}

    ${({disabled, theme}) => disabled && `
        color: ${theme.colors.text};
        opacity: 0.5;
        pointer-events: none;
        cursor: not-allowed;
    `}
`;