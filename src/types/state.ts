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

export const initialState: State = {
  additionalImageUrls: [],
  currentPage: 1,
  filterBySale: false,
  gender: 'all',
  maxProductsPerPage: 100,
  products: [],
  searchQuery: '',
  showAdditionalImage: false,
  pageState: {
    currentPage: 0,
    searchQuery: undefined,
    totalPages: 3,
    size: 2,
    rate: 'all'
  }
};

export interface SingleState {
  product: PrintModel | null;
}

export const initialSingleState: SingleState = {
  product: null,
};

export interface PageState {
  currentPage: number;
  searchQuery: string | undefined;
  totalPages: number | undefined;
  size: number
  rate: string
}