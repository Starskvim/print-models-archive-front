// import { Product } from "./product";
import {PrintModelCard} from "./PrintModelCard";
import {PrintModel} from "./PrintModel";

export interface State {
  additionalImageUrls: string[];
  currentPage: number;
  filterBySale: boolean;
  gender: 'all' | 'male' | 'female' | 'unisex';
  maxProductsPerPage: number;
  products: PrintModelCard[];
  searchQuery: string;
  showAdditionalImage: boolean;
  pageState: PageState
}

export const InitialState: State = {
  additionalImageUrls: [],
  currentPage: 1,
  filterBySale: false,
  gender: 'all',
  maxProductsPerPage: 100,
  products: [],
  searchQuery: '',
  showAdditionalImage: false,
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