import {PrintModelCard} from "../types/PrintModelCard";
import AsyncImage from './AsyncImage';
import {NavLink} from "react-router-dom";
import React from "react";
import styled from "styled-components";

const PrintModelCardComponent = (
    {
        product,
        cachedImages
    }: {
        product: PrintModelCard,
        cachedImages: { [url in string]: HTMLImageElement }
    }
) =>
    <div className="card" style={{width: '300px', margin: 'auto'}}>
        <AsyncImage
            src={product.preview}
            className="card-img-top"
            width={300}
            height={300}
            cachedImages={cachedImages}
            bgColor={'hsl(0, 0%, 100%)'}
            preloadBgColor={'hsl(0, 0%, 75%)'}
        />
        <div className="card-body">
            <Nav>
                <NavLink to={`/models/${product.id}`} className="navbar-link">
                    {product.modelName}
                </NavLink>
            </Nav>
            {/*<h5 className="card-title">{product.modelName}</h5>*/}
            {/*<p className="card-text">{product.modelName}</p>*/}
            <p className="card-text">Id - {product.id}</p>
            <p className="card-text">Rate - {product.rate}</p>
            {/*<p className="card-text" style={{textDecoration: 'line-through'}}>{product.id}</p>*/}
            {/*<p className="card-text">{product.id}</p>*/}
        </div>
    </div>;


const Nav = styled.nav`

    .navbar-link {
        &:link,
        &:visited {
            display: inline-block;
            text-decoration: none;
            font-size: 1.8rem;
            font-weight: 500;
            // color: ${({theme}) => theme.colors.black};
            transition: color 0.3s linear;
        }

        &:hover,
        &:active {
            color: ${({theme}) => theme.colors.helper};
        }
    }
`;

export default PrintModelCardComponent;