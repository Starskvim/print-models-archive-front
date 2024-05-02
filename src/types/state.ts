// import { Product } from "./product";
import {PrintModelCard} from "./PrintModelCard";

export interface State {
  additionalImageUrls: string[];
  currentPage: number;
  filterBySale: boolean;
  gender: 'all' | 'male' | 'female' | 'unisex';
  maxProductsPerPage: number;
  products: PrintModelCard[];
  searchQuery: string;
  showAdditionalImage: boolean;
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
};

export interface SingleState {
  product: PrintModelCard | null;
}

export const initialSingleState: SingleState = {
  product: null,
};