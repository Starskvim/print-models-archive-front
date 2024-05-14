import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import React from "react";
import styled from "styled-components";

const RateFilterComponent = (
    {
        rate,
        onChange
    }: {
        rate: string
        onChange: Function
    }
) => (
    <div style={{width:"15%", display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <StyledDropdownButton
            id="dropdown-basic-button"
            title={`By Rate (${rate})`}
        >
            <Dropdown.Item onClick={() => onChange('all')} active={rate === 'all'}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => onChange('1')} active={rate === '1'}>1</Dropdown.Item>
            <Dropdown.Item onClick={() => onChange('2')} active={rate === '2'}>2</Dropdown.Item>
            <Dropdown.Item onClick={() => onChange('3')} active={rate === '3'}>3</Dropdown.Item>
            <Dropdown.Item onClick={() => onChange('4')} active={rate === '4'}>4</Dropdown.Item>
            <Dropdown.Item onClick={() => onChange('5')} active={rate === '5'}>5</Dropdown.Item>
        </StyledDropdownButton>
    </div>
);


const StyledDropdownButton = styled(DropdownButton)`
    font-size: 18px;
    padding: 10px 20px;
    .btn {
        padding: 5px 10px;  // Увеличиваем отступы кнопки
    }
`;

export default RateFilterComponent;