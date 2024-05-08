import {PrintModelCard} from "../../types/PrintModelCard";
import AsyncImage from '../AsyncImage';
import {NavLink} from "react-router-dom";
import React from "react";
import styled from "styled-components";
import {toStringDate} from "../../utils/DateUtils";
import StarRatingComponent from "./StarRatingComponent";
import AdultContentIndicatorComponent from "./AdultContentIndicatorComponent";
import { DivRowStyled } from "../../styles/DivRowStyled";

const PrintModelCardComponent = (
    {
        product
    }: {
        product: PrintModelCard
    }
) =>
    <div className="card" style={{width: '300px', margin: 'auto'}}>
        <AsyncImage
            src={product.preview}
            className="card-img-top"
            cachedImages={{}}
            width={300}
            height={300}
            bgColor={'hsl(0, 0%, 100%)'}
            preloadBgColor={'hsl(0, 0%, 75%)'}
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
                    <AdultContentIndicatorComponent isVisible={product?.nsfw}/>
                </div>
            </DivRowStyled>
        </div>
    </div>;


const NavStyled = styled.nav`

    .navbar-link {
        &:link,
        &:visited {
            text-align: center;
            display: inline-block;
            text-decoration: none;
            font-size: 1.8rem;
            font-weight: 500;
                // color: ${({theme}) => theme.colors.black};
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