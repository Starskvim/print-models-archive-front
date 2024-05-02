import {Component} from "react";
import styled from "styled-components";
import {initialSingleState, initialState, SingleState, State} from "../types/state";
import {getModelCard} from "../services/ProductService";
// import PrintModelCardComponent from "../components/PrintModelCardComponent";
// import PrintModelComponent from "../components/PrintModelComponent";
import PrintModelComponent from "../components/PrintModelComponent";

// interface RouteParams {
//     id: string;
// }

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
        const {id} = this.props;
        const {product} = this.state;
        console.log("ModelPage product - " + this.state)
        return (
            <Wrapper>
                <div>
                    <div>
                        <h1>{product?.modelName}</h1>
                        {/*<p>Model ID: {id}</p>*/}
                        {/*<p>Model name: {product?.modelName}</p>*/}
                        {/*<p>Model name: {product?.preview}</p>*/}
                    </div>
                    <div className="col my-3">
                        <PrintModelComponent product={product}/>
                    </div>
                </div>
            </Wrapper>
        );
    }
}


const Wrapper = styled.section`
    

    @media (max-width: ${({theme}) => theme.media.mobile}) {
        padding: 0 2.4rem;
    }
`;