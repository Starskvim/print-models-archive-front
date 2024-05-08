import {PrintModel} from "../../types/PrintModel";
import AsyncImage from '../AsyncImage';
import styled from "styled-components";
import React from "react";
import {toStringDate} from "../../utils/DateUtils";
import {DivRowStyled} from "../../styles/DivRowStyled";
import StarRatingComponent from "./StarRatingComponent";
import AdultContentIndicatorComponent from "./AdultContentIndicatorComponent";
import { Link } from 'react-router-dom';

const PrintModelComponent = (
    {
        product
    }: {
        product: PrintModel,
    }
) =>
    <ModelStyled>
        <div className="card" style={{width: '600px', margin: 'auto'}}>
            <AsyncImage
                src={product?.preview}
                className="main-preview"
                width={300}
                height={300}
                cachedImages={{}}
                bgColor={'hsl(0, 0%, 100%)'}
                preloadBgColor={'hsl(0, 0%, 75%)'}
            />
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
                <p className="card-text">Added at - {toStringDate(product.addedAt!!)}</p>
                <DivRowStyled>
                    <div className="content-row">
                        <StarRatingComponent selectedStars={product.rate}/>
                        <AdultContentIndicatorComponent isVisible={product.nsfw}/>
                    </div>
                </DivRowStyled>
            </div>
        </div>
        ;
    </ModelStyled>


const ModelStyled = styled.section`

    .main-preview {
        //border-radius: 15px;
        box-shadow: 0 0 10px 5px #000;
    }

    @media (max-width: ${({theme}) => theme.media.mobile}) {
        padding: 0 2.4rem;
    }
`;

export default PrintModelComponent;