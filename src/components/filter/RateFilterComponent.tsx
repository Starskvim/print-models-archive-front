import React from "react";
import styled from "styled-components";
import {filterControlCss} from "./FilterControl";

const OPTIONS = [
    {value: 'all', label: 'Any rating'},
    {value: '1', label: '★ 1+'},
    {value: '2', label: '★ 2+'},
    {value: '3', label: '★ 3+'},
    {value: '4', label: '★ 4+'},
    {value: '5', label: '★ 5'},
];

const RateFilterComponent = (
    {
        rate,
        onChange
    }: {
        rate: string
        onChange: (rate: string) => void
    }
) => (
    <SelectStyled
        aria-label="Filter by rating"
        value={rate}
        className={rate !== 'all' ? 'active' : ''}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
    >
        {OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
        ))}
    </SelectStyled>
);

interface SelectStyledProps {
    'aria-label': string;
    value: string;
    className: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children: React.ReactNode;
}

const SelectStyled = styled.select<SelectStyledProps>`
    ${filterControlCss}
    appearance: none;
    padding-right: 32px;
    background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
        linear-gradient(135deg, currentColor 50%, transparent 50%);
    background-position: calc(100% - 17px) 50%, calc(100% - 12px) 50%;
    background-size: 5px 5px;
    background-repeat: no-repeat;

    option {
        background-color: ${({theme}) => theme.colors.input_bg};
        color: ${({theme}) => theme.colors.text};
    }
`;

export default RateFilterComponent;
