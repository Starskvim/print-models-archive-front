import React from 'react';
import styled from "styled-components";

interface StarRatingProps {
    totalStars?: number;
    selectedStars: number;

}

const Star: React.FC<{ selected: boolean }> = ({selected}) => (
    <span className="star" style={{cursor: 'pointer', color: selected ? 'orange' : 'grey'}}>
★
  </span>
);

const StarRatingComponent: React.FC<StarRatingProps> = ({totalStars = 5, selectedStars}) => {
    return (
        <RatingStyled>
            <div className="star-rating">
                {Array.from({length: totalStars}, (_, i) => (
                    <Star key={i} selected={i < selectedStars}/>
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
        font-size: 24px; /* Размер звезд */
        cursor: pointer;
        transition: color 0.2s ease-in-out; /* Плавное изменение цвета */
        //color: #ffeb3b /* Цвет при наведении
    }

`;

export default StarRatingComponent;