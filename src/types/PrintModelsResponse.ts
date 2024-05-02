import {PrintModelCard} from "./PrintModelCard";

export interface PrintModelsResponse {

    models: PrintModelCard[],
    totalElements: number,
    totalPages: number

}