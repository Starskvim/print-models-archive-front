import {PrintModelCard} from "../types/PrintModelCard";
import {PrintModel} from "../types/PrintModel";

export interface GlobalState {
    product: PrintModel | undefined,
    products: PrintModelCard[],
    categoryName: string | undefined,
    searchQuery: string | undefined;
    currentPage: number;
    totalPages: number | undefined;
    size: number
    rate: string
}

export const InitialGlobalState: GlobalState = {
    product: undefined,
    products: [],
    searchQuery: undefined,
    categoryName: undefined,
    currentPage: 1,
    totalPages: undefined,
    size: 1,
    rate: 'all'
};

export interface State {
    product: PrintModel | undefined;
    products: PrintModelCard[];
    pageState: PageState
}

export const InitialState: State = {
    product: undefined,
    products: [],
    pageState: {
        searchQuery: undefined,
        categoryName: undefined,
        currentPage: 0,
        totalPages: undefined,
        size: 2,
        rate: 'all'
    }
};

export interface SingleState {
    product: PrintModel | undefined;
}

export const InitialSingleState: SingleState = {
    product: undefined,
};

export interface PageState {
    categoryName: string | undefined,
    searchQuery: string | undefined;
    currentPage: number;
    totalPages: number | undefined;
    size: number
    rate: string
}