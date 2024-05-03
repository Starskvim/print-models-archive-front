import React, {Component} from "react";
import styled from "styled-components";
import {initialSingleState, initialState, SingleState, State} from "../types/state";
import {getModelCard} from "../services/ProductService";
import PrintModelComponent from "../components/PrintModelComponent";
import AsyncImage from "../components/AsyncImage";
import { Helmet } from "react-helmet";

export class ModelPage extends Component<{ id: string }> {

    state: SingleState = initialSingleState;

    async componentDidMount() {
        try {
            const {id} = this.props; // Получаем id непосредственно из props
            const product = await getModelCard(id); // Используем id для вызова функции
            console.log('Product from getCard:', product);
            this.setState({product});
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    }

    render() {
        const {product} = this.state;
        console.log("render ModelPage product - " + JSON.stringify(this.state))
        return (
            <ModelPageStyled>
                <Helmet>
                    <title>{product?.modelName}</title>
                </Helmet>
                <div>
                    <div className="col my-3">
                        <PrintModelComponent product={product}/>
                    </div>
                    {
                        product?.oths.map(oth => (
                                <div className="card" style={{width: '600px', margin: 'auto'}}>
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
                            )
                        )
                    }
                </div>
            </ModelPageStyled>
        );
    }
}


const ModelPageStyled = styled.section`

    .oth-preview {
        //border-radius: 15px;
        box-shadow: 0 0 10px 5px #000;
    }

    @media (max-width: ${({theme}) => theme.media.mobile}) {
        padding: 0 2.4rem;
    }
`;