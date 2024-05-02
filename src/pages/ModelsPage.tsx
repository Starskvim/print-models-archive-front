import React, {Component} from "react";
import {initialState, State} from "../types/state";
import {fetchModelCards} from "../services/ProductService";
import {PrintModelCard} from "../types/PrintModelCard";
import {paginate} from "../utils/paginate";
import SearchBox from "../components/SearchBox";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import ToggleButton from "react-bootstrap/ToggleButton";
import PrintModelCardsComponent, {DEFAULT_PAGE_SIZE} from "../components/PrintModelCardsComponent";
import ImageOverlay from "../components/ImageOverlay";

export class ModelsPage extends Component {

    state: State = initialState;
    cachedImages: { [url in string]: HTMLImageElement } = {};

    async componentDidMount() {
        // const products = await getModelCards();

        const response = await fetchModelCards(
            "0",
            DEFAULT_PAGE_SIZE.toString(),
            undefined,
            this.state.pageState.searchQuery,
            undefined,
            undefined
        );
        this.state.pageState.totalPages = response.totalPages
        this.state.pageState.size = response.totalElements
        this.setState({products: response.models});
    }

    getFilteredCards = () => {
        const {
            filterBySale,
            gender,
            products: allProducts,
            searchQuery,
        } = this.state;

        let filtered = allProducts;
        if (searchQuery) {
            filtered = allProducts.filter(p => p.modelName.toLowerCase().includes(searchQuery.toLowerCase()))
        }
        if (gender !== 'all') {
            filtered = filtered.filter(p => p.modelName === gender);
        }
        if (filterBySale) {
            filtered = filtered.filter(p => p.rate > p.rate);
        }

        return filtered;
    };

    handleSearch = (query: string) => {
        this.setState({searchQuery: query, currentPage: 1});
    };

    handleGenderFilter = (gender: string) => {
        this.setState({gender, currentPage: 1});
    };


    handleSaleFilter = (filterBySale: boolean) => {
        this.setState({filterBySale, currentPage: 1});
    };

    handlePageChange = (page: number) => {
        this.setState({currentPage: page});
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
            "2",
            undefined,
            this.state.pageState.searchQuery,
            undefined,
            undefined
        );
        console.log("fetchModelCards" + JSON.stringify(response));
        this.state.pageState.currentPage = target;
        this.state.pageState.totalPages = response.totalPages
        this.state.pageState.size = response.totalElements
        this.setState({products: response.models});
    };

    render() {
        const {
            additionalImageUrls,
            currentPage,
            filterBySale,
            gender,
            maxProductsPerPage,
            searchQuery,
            showAdditionalImage,
        } = this.state;

        const filtered = this.getFilteredCards();
        const paginated: PrintModelCard[] = paginate(
            filtered,
            currentPage,
            maxProductsPerPage
        );

        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <SearchBox value={searchQuery} onChange={this.handleSearch}/>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '260px'}}>
                        <DropdownButton id="dropdown-basic-button" title={`Filter by Gender (${gender})`}>
                            <Dropdown.Item onClick={() => this.handleGenderFilter('all')}
                                           active={gender === 'all'}>All</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.handleGenderFilter('male')}
                                           active={gender === 'male'}>Male</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.handleGenderFilter('female')}
                                           active={gender === 'female'}>Female</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.handleGenderFilter('unisex')}
                                           active={gender === 'unisex'}>Unisex</Dropdown.Item>
                        </DropdownButton>
                    </div>
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
                    products={paginated}
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