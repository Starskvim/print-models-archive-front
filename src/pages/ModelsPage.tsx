import React, {Component, useEffect} from "react";
import {initialState, State} from "../types/state";
import {fetchModelCards} from "../services/ProductService";
import {PrintModelCard} from "../types/PrintModelCard";
import SearchBox from "../components/SearchBox";
import ToggleButton from "react-bootstrap/ToggleButton";
import PrintModelCardsComponent, {DEFAULT_PAGE_SIZE} from "../components/card/PrintModelCardsComponent";
import ImageOverlay from "../components/ImageOverlay";
import RateFilterComponent from "../components/RateFilterComponent";
import {PAGE_SIZE} from "../configuration/Config";

export class ModelsPage extends Component {

    state: State = initialState;
    cachedImages: { [url in string]: HTMLImageElement } = {};

    async componentDidMount() {
        const response = await fetchModelCards(
            this.state.pageState.currentPage.toString(),
            PAGE_SIZE.toString(),
            undefined,
            this.state.pageState.searchQuery,
            undefined,
            this.state.pageState.rate
        );
        // TODO
        this.setState(prevState => ({
            ...initialState,
            pageState: {
                ...initialState.pageState,
                totalPages: response.totalPages,
                size: response.totalElements
            },
            products: response.models
        }));
    }

    async componentDidUpdate() {
        window.scrollTo(0, 0);
    }

    handleProductClick = (product: PrintModelCard) => {
        const urls = product.images;
        if (urls === undefined || urls.length < 1) return;
        this.setState({showAdditionalImage: true, additionalImageUrls: urls});
    };

    handleOverlayBgClick = () => {
        this.setState({showAdditionalImage: false, additionalImageUrls: []});
    };

    handlePageClick = async (target: number) => {
        // this.state.pageState.currentPage = target;
        // this.state.pageState.totalPages = response.totalPages
        // this.state.pageState.size = response.totalElements
        // this.setState({products: response.models});
        const response = await fetchModelCards(
            (target - 1).toString(),
            PAGE_SIZE.toString(),
            undefined,
            this.state.pageState.searchQuery,
            undefined,
            this.state.pageState.rate
        );
        this.setState(prevState => ({
            pageState: {
                searchQuery: this.state.pageState.searchQuery,
                currentPage: target,
                totalPages: response.totalPages,
                size: response.totalElements,
                rate: this.state.pageState.rate
            },
            products: response.models
        }));
        console.log("fetchModelCards" + JSON.stringify(response));
    };

    handleRateFilter = async (rate: string) => {
        // this.state.pageState.rate = rate
        // this.state.pageState.currentPage = 0
        // this.state.pageState.totalPages = response.totalPages
        // this.state.pageState.size = response.totalElements
        // this.setState({products: response.models});
        const response = await fetchModelCards(
            "0",
            PAGE_SIZE.toString(),
            undefined,
            this.state.pageState.searchQuery,
            undefined,
            rate
        );
        this.setState(prevState => ({
            ...initialState, // todo not work
            pageState: {
                ...initialState.pageState, // todo not work
                searchQuery: this.state.pageState.searchQuery,
                totalPages: response.totalPages,
                size: response.totalElements,
                rate: rate
            },
            products: response.models
        }));
        console.log("rate", this.state.pageState.rate);
    };

    handleSearch = async (query: string) => {
        // this.state.pageState.searchQuery = query
        // this.state.pageState.currentPage = 0
        // const response = await this.fetchStateUpdates()
        // this.state.pageState.totalPages = response.totalPages
        // this.state.pageState.size = response.totalElements
        // this.setState({products: response.models});
        const response = await fetchModelCards(
            "0",
            PAGE_SIZE.toString(),
            undefined,
            query,
            undefined,
            this.state.pageState.rate
        );
        this.setState(prevState => ({
            pageState: {
                searchQuery: query,
                currentPage: "0",
                totalPages: response.totalPages,
                size: response.totalElements,
                rate: this.state.pageState.rate
            },
            products: response.models
        }));
        console.log("query", this.state.pageState.searchQuery);
    };

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