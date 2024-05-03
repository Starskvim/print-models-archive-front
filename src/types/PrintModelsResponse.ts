import {PrintModelCard} from "./PrintModelCard";

export interface PrintModelsResponse {

    models: PrintModelCard[] | undefined,
    totalElements: number,
    totalPages: number

}