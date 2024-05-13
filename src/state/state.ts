import {PrintModelCard} from "../types/PrintModelCard";
import {PrintModel} from "../types/PrintModel";
import {Category} from "../types/catalog/Catalog";

export interface GlobalState {
    product: PrintModel | undefined,
    products: PrintModelCard[],
    categoryName: string | undefined,
    searchQuery: string | undefined,
    currentPage: number,
    totalPages: number | undefined,
    size: number,
    rate: string,
    nsfwOnly: boolean,
    selectedCategory: string,
    catalog: Category[],
    categories: Category[],

}

export const InitialGlobalState: GlobalState = {
    product: undefined,
    products: [],
    searchQuery: undefined,
    categoryName: undefined,
    currentPage: 1,
    totalPages: undefined,
    size: 1,
    rate: 'all',
    nsfwOnly: false,
    selectedCategory: 'all',
    catalog: [],
    categories: []
};