import React from 'react';
import styled from "styled-components";

interface AdultContentIndicatorProps {
    isVisible: boolean;
}

const NSFWIndicatorComponent: React.FC<AdultContentIndicatorProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <AdultStyled>
            <div className="adult-indicator">18+</div>
        </AdultStyled>
    );
};

const AdultStyled = styled.section`

    .adult-indicator {
        padding: 5px 10px;
        margin: 5px 0;
        background-color: red;
        color: white;
        font-weight: bold;
        border-radius: 5px;
        display: inline-block;
        font-size: 14px;
    }

`;

export default NSFWIndicatorComponent;