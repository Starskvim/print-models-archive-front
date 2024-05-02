import {PrintModel} from "../types/PrintModel";
import AsyncImage from './AsyncImage';
import styled from "styled-components";
import React from "react";
import { Helmet } from 'react-helmet';

const PrintModelComponent = (
    {
        product
    }: {
        product: PrintModel | null,
    }
) =>
    <Wrapper>
        <Helmet>
            <title>{product?.modelName}</title>
        </Helmet>
        <div className="card" style={{width: '300px', margin: 'auto'}}>
            <AsyncImage
                src={product?.preview}
                className="card-img-top"
                width={300}
                height={300}
                cachedImages={{}}
                bgColor={'hsl(0, 0%, 100%)'}
                preloadBgColor={'hsl(0, 0%, 75%)'}
            />
            <div className="card-body">
                <h5 className="card-title">{product?.modelName}</h5>
                <p className="card-text">Id - {product?.id}</p>
                <p className="card-text">Added at - {product?.addedAt}</p>
                <p className="card-text">NSFW - {product?.nsfw}</p>
                <p className="card-text">Rate - {product?.rate}</p>
            </div>
        </div>
        ;
    </Wrapper>


const Wrapper = styled.section`


    @media (max-width: ${({theme}) => theme.media.mobile}) {
        padding: 0 2.4rem;
    }
`;

export default PrintModelComponent;