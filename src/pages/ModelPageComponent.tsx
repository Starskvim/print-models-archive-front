import React, {useEffect} from "react";
import styled from "styled-components";
import {getModelCard} from "../services/ProductService";
import PrintModelComponent from "../components/card/PrintModelComponent";
import AsyncImage from "../components/AsyncImage";
import {Helmet} from "react-helmet";
import {useParams} from "react-router-dom";
import {useAppContext} from "../state/AppContext";

const ModelPageComponent: React.FC = () => {

    const {id} = useParams<{ id: string }>();

    const {globalState, updateGlobalState} = useAppContext();

    useEffect(() => {
        const fetchProduct = async () => {
            const productData = await getModelCard(id!!);
            console.log('Product from getCard:', productData);
            updateGlobalState({
                product: productData
            })
        };
        fetchProduct();
    }, [id]);

    console.log("render ModelPage product - " + JSON.stringify(globalState.product));

    return (
        <ModelPageStyled>
            <Helmet>
                <title>{globalState.product?.modelName}</title>
            </Helmet>
            <div>
                <div className="col my-3">
                    {globalState.product ? <PrintModelComponent product={globalState.product}/> : <p>Error</p>}
                </div>
                {
                    globalState.product?.oths.map(oth => (
                        <div className="card" key={oth.preview} style={{width: '600px', margin: 'auto'}}>
                            <AsyncImage
                                src={oth.preview}
                                className="oth-preview"
                                width={200}
                                height={200}
                                cachedImages={{}}
                                bgColor={'hsl(0, 0%, 100%)'}
                                preloadBgColor={'hsl(0, 0%, 75%)'}
                            />
                        </div>
                    ))
                }
            </div>
        </ModelPageStyled>
    );
};

export default ModelPageComponent;

const ModelPageStyled = styled.section`

    .oth-preview {
        width: 100%; /* Занимает всю ширину карточки */
        height: auto;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        object-fit: cover;
    }

    @media (max-width: ${({theme}) => theme.media.mobile}) {
        padding: 0 2.4rem;
    }
`;