import {css} from "styled-components";

// Shared look for header filters: same height and radius as the search input.
// Add the `active` class for the "filter is applied" state.
export const filterControlCss = css`
    height: 44px;
    padding: 0 14px;
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    background-color: ${({theme}) => theme.colors.input_bg};
    color: ${({theme}) => theme.colors.text};
    transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        border-color: ${({theme}) => theme.colors.btn};
    }

    &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px ${({theme}) => theme.colors.border};
    }

    &.active {
        background-color: ${({theme}) => theme.colors.btn};
        border-color: ${({theme}) => theme.colors.btn};
        color: #fff;
    }
`;
