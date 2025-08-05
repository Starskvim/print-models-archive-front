import {PrintModel} from "../../types/PrintModel";
import AsyncImage from '../AsyncImage';
import styled from "styled-components";
import React from "react";
import {toStringDate} from "../../utils/DateUtils";
import {DivRowStyled} from "../../styles/DivRowStyled";
import StarRatingComponent from "./StarRatingComponent";
import NSFWIndicatorComponent from "./NSFWIndicatorComponent";
import { Link } from 'react-router-dom';

const PrintModelComponent = (
    {
        product
    }: {
        product: PrintModel,
    }
) =>
    <Styled>
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{product.modelName}</h5>
                <p className="card-text">Path - {product.path}</p>
                <p className="card-text">Category - {product.category}</p>
                <p className="card-text">Categories - {product.categories.map((cat, index) => (
                    <React.Fragment key={index}>
                        <Link to={`/models/category/${cat}`} style={{marginRight: '5px'}}>{cat}</Link>
                        {index < product.categories.length - 1 ? ' -> ' : ''}
                    </React.Fragment>
                ))}</p>
                <p className="card-text">Added at - {toStringDate(product.addedAt)}</p>
                <DivRowStyled>
                    <div className="content-row">
                        <StarRatingComponent selectedStars={product.rate}/>
                        <NSFWIndicatorComponent isVisible={product.nsfw}/>
                    </div>
                </DivRowStyled>
            </div>
        </div>
        ;
    </Styled>


const Styled = styled.section`

    @media (max-width: ${({theme}) => theme.media.mobile}) {
        padding: 0 2.4rem;
    }

    .card-title {
        font-size: 24px;
        font-weight: bold;
        color: ${({theme}) => theme.colors.heading};
        margin-bottom: 10px;
    }

    .card {
        width: 600px;
        margin: 30px auto;
        box-shadow: ${({theme}) => theme.colors.shadow};
        border-radius: 8px;
        overflow: hidden;
        background: ${({theme}) => theme.colors.card_bg};
        border: 1px solid ${({theme}) => theme.colors.border};
    }

    .main-preview {
        width: 100%; /* Занимает всю ширину карточки */
        height: auto;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        object-fit: cover;
    }

    .card-text {
        font-size: 16px;
        color: ${({theme}) => theme.colors.text};
        line-height: 1.5;
    }

    a {
        color: ${({theme}) => theme.colors.helper};
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
        color: ${({theme}) => theme.colors.btn};
    }
`;

export default PrintModelComponent;