import {PrintModelCard} from "../../types/PrintModelCard";
import AsyncImage from '../AsyncImage';
import {NavLink} from "react-router-dom";
import React from "react";
import styled from "styled-components";
import {toStringDate} from "../../utils/DateUtils";
import StarRatingComponent from "./StarRatingComponent";
import NSFWIndicatorComponent from "./NSFWIndicatorComponent";
import { DivRowStyled } from "../../styles/DivRowStyled";

const PrintModelCardComponent = (
    {
        product
    }: {
        product: PrintModelCard
    }
) =>
    <CardStyled>
        <AsyncImage
            src={product.preview}
            className="card-img-top"
            cachedImages={{}}
            width={300}
            height={300}
            bgColor={undefined}
            preloadBgColor={undefined}
        />
        <div className="card-body">
            <NavStyled>
                <NavLink to={`/models/${product.id}`} className="navbar-link">
                    {product.modelName}
                </NavLink>
            </NavStyled>
            <p className="card-text">Category - {product.category}</p>
            <p className="card-text">Added at - {toStringDate(product?.addedAt!!)}</p>
            <DivRowStyled>
                <div className="content-row">
                    <StarRatingComponent selectedStars={product.rate}/>
                    <NSFWIndicatorComponent isVisible={product?.nsfw}/>
                </div>
            </DivRowStyled>
        </div>
    </CardStyled>;


const CardStyled = styled.div`
    width: 300px;
    margin: auto;
    background-color: ${({theme}) => theme.colors.card_bg};
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: 8px;
    box-shadow: ${({theme}) => theme.colors.shadowSupport};
    overflow: hidden;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: ${({theme}) => theme.colors.shadow};
    }
    
    .card-img-top {
        width: 100%;
        height: 300px;
        object-fit: cover;
    }
    
    .card-body {
        padding: 16px;
    }
    
    .card-text {
        color: ${({theme}) => theme.colors.text};
        font-size: 14px;
        margin-bottom: 8px;
    }
`;

const NavStyled = styled.nav`
    .navbar-link {
        &:link,
        &:visited {
            text-align: center;
            display: inline-block;
            text-decoration: none;
            font-size: 1.8rem;
            font-weight: 500;
            color: ${({theme}) => theme.colors.heading};
            transition: color 0.3s linear;
        }

        &:hover,
        &:active {
            text-align: center;
            color: ${({theme}) => theme.colors.helper};
        }
    }
`;

export default PrintModelCardComponent;