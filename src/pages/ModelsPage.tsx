import React, {Component, useEffect} from "react";
import {InitialState, State} from "../types/state";
import {fetchModelCards} from "../services/ProductService";
import {PrintModelCard} from "../types/PrintModelCard";
import SearchBox from "../components/SearchBox";
import ToggleButton from "react-bootstrap/ToggleButton";
import PrintModelCardsComponent, {DEFAULT_PAGE_SIZE} from "../components/card/PrintModelCardsComponent";
import ImageOverlay from "../components/ImageOverlay";
import RateFilterComponent from "../components/RateFilterComponent";
import {PAGE_SIZE} from "../configuration/Config";

export class ModelsPage extends Component<{ categoryName: string | undefined }> {

    state: State = InitialState;
    cachedImages: { [url in string]: HTMLImageElement } = {};

    async componentDidMount() {
        const {categoryName} = this.props;

        console.log("componentDidMount - " + categoryName);

        const response = await fetchModelCards(
            this.state.pageState.currentPage.toString(),
            PAGE_SIZE.toString(),
            undefined,
            this.state.pageState.searchQuery,
            categoryName,
            this.state.pageState.rate
        );
        this.setState(prevState => ({
            ...InitialState,
            pageState: {
                ...InitialState.pageState,
                categoryName: categoryName,
                totalPages: response.totalPages,
                size: response.totalElements
            },
            products: response.models
        }));
    }

    // TODO category update?
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
        const response = await fetchModelCards(
            (target - 1).toString(),
            PAGE_SIZE.toString(),
            undefined,
            this.state.pageState.searchQuery,
            this.state.pageState.categoryName,
            this.state.pageState.rate
        );
        this.setState(prevState => ({
            pageState: {
                searchQuery: this.state.pageState.searchQuery,
                categoryName: this.state.pageState.categoryName,
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
        const response = await fetchModelCards(
            "0",
            PAGE_SIZE.toString(),
            undefined,
            this.state.pageState.searchQuery,
            this.state.pageState.categoryName,
            rate
        );
        this.setState(prevState => ({
            ...InitialState, // todo not work
            pageState: {
                ...InitialState.pageState, // todo not work
                searchQuery: this.state.pageState.searchQuery,
                categoryName: this.state.pageState.categoryName,
                totalPages: response.totalPages,
                size: response.totalElements,
                rate: rate
            },
            products: response.models
        }));
        console.log("rate", this.state.pageState.rate);
    };

    handleSearch = async (query: string) => {
        const response = await fetchModelCards(
            "0",
            PAGE_SIZE.toString(),
            undefined,
            query,
            this.state.pageState.categoryName,
            this.state.pageState.rate
        );
        this.setState(prevState => ({
            pageState: {
                searchQuery: query,
                categoryName: this.state.pageState.categoryName,
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
        console.log("render - category", this.state.pageState.categoryName);
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