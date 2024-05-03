import React, {Component} from "react";
import {initialState, State} from "../types/state";
import {fetchModelCards} from "../services/ProductService";
import {PrintModelCard} from "../types/PrintModelCard";
import SearchBox from "../components/SearchBox";
import ToggleButton from "react-bootstrap/ToggleButton";
import PrintModelCardsComponent, {DEFAULT_PAGE_SIZE} from "../components/PrintModelCardsComponent";
import ImageOverlay from "../components/ImageOverlay";
import RateFilterComponent from "../components/RateFilterComponent";
import {PrintModelsResponse} from "../types/PrintModelsResponse";

export class ModelsPage extends Component {

    state: State = initialState;
    cachedImages: { [url in string]: HTMLImageElement } = {};

    async componentDidMount() {
        const response = await fetchModelCards(
            this.state.pageState.currentPage.toString(),
            DEFAULT_PAGE_SIZE.toString(),
            undefined,
            this.state.pageState.searchQuery,
            undefined,
            this.state.pageState.rate
        );
        this.state.pageState.totalPages = response.totalPages
        this.state.pageState.size = response.totalElements
        this.setState({products: response.models});
    }

    handleSaleFilter = (filterBySale: boolean) => {
        this.setState({filterBySale, currentPage: 1});
    };

    handleProductClick = (product: PrintModelCard) => {
        const urls = product.images;
        if (urls === undefined || urls.length < 1) return;
        this.setState({showAdditionalImage: true, additionalImageUrls: urls});
    };

    handleOverlayBgClick = () => {
        this.setState({showAdditionalImage: false, additionalImageUrls: []});
    };

    handlePageClick = async (target: number) => {
        const response = await fetchModelCards(
            (target - 1).toString(),
            DEFAULT_PAGE_SIZE.toString(),
            undefined,
            this.state.pageState.searchQuery,
            undefined,
            undefined
        );
        this.state.pageState.currentPage = target;
        this.state.pageState.totalPages = response.totalPages
        this.state.pageState.size = response.totalElements
        this.setState({products: response.models});
        console.log("fetchModelCards" + JSON.stringify(response));
    };

    handleRateFilter = async (rate: string) => {
        this.state.pageState.rate = rate
        const response = await this.fetchStateUpdates()
        this.state.pageState.totalPages = response.totalPages
        this.state.pageState.size = response.totalElements
        this.setState({products: response.models});
        console.log("rate", this.state.pageState.rate);
    };

    handleSearch = async (query: string) => {
        this.state.pageState.searchQuery = query
        const response = await this.fetchStateUpdates()
        this.state.pageState.totalPages = response.totalPages
        this.state.pageState.size = response.totalElements
        this.setState({products: response.models});
        console.log("query", this.state.pageState.searchQuery);
    };

    async fetchStateUpdates(): Promise<PrintModelsResponse> {
        return fetchModelCards(
            this.state.pageState.currentPage.toString(),
            DEFAULT_PAGE_SIZE.toString(),
            undefined,
            this.state.pageState.searchQuery,
            undefined,
            this.state.pageState.rate
        );
    }

    render() {
        const {
            additionalImageUrls,
            filterBySale,
            showAdditionalImage,
            products: allProducts
        } = this.state;

        console.log("render - rate", this.state.pageState.rate);

        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <SearchBox value={this.state.pageState.searchQuery} onChange={this.handleSearch}/>
                    </div>
                    <RateFilterComponent
                        rate={this.state.pageState.rate}
                        onChange={this.handleRateFilter}
                    />
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '150px'}}>
                        <ToggleButton
                            id="toggle-check"
                            type="checkbox"
                            variant="outline-primary"
                            checked={filterBySale}
                            value="1"
                            onChange={(e) => this.handleSaleFilter(e.currentTarget.checked)}
                        >
                            Filter by Sale
                        </ToggleButton>
                    </div>
                </div>
                <PrintModelCardsComponent
                    products={allProducts}
                    onProductClick={this.handleProductClick}
                    cachedImages={this.cachedImages}
                    pageState={this.state.pageState}
                    onPageChange={this.handlePageClick}
                />
                {showAdditionalImage ? <ImageOverlay
                    additionalImageUrls={additionalImageUrls}
                    onBgClick={this.handleOverlayBgClick}
                    cachedImages={this.cachedImages}
                /> : null}
            </div>
        );
    }
}