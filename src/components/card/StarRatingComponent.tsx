import React from 'react';
import styled from "styled-components";

interface StarRatingProps {
    totalStars?: number;
    selectedStars: number;
}

const StarRatingComponent: React.FC<StarRatingProps> = ({totalStars = 5, selectedStars}) => {
    return (
        <RatingStyled>
            <div className="star-rating">
                {Array.from({length: totalStars}, (_, i) => (
                    <span 
                        key={i} 
                        className={`star ${i < selectedStars ? 'selected' : ''}`}
                    >
                        ★
                    </span>
                ))}
            </div>
        </RatingStyled>
    );
};

const RatingStyled = styled.section`
    .star-rating {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .star {
        font-size: 24px;
        cursor: pointer;
        color: ${({theme}) => theme.colors.text};
        transition: color 0.2s ease-in-out;
        
        &.selected {
            color: ${({theme}) => theme.colors.helper};
        }

        &:hover {
            color: ${({theme}) => theme.colors.helper};
        }

        &.selected:hover {
            color: ${({theme}) => theme.colors.helper};
        }
    }
`;

export default StarRatingComponent;