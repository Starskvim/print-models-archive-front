import http from './ApiService';
import {PrintModelsResponse} from '../types/PrintModelsResponse';
import {PrintModelResponse} from "../types/PrintModelResponse";
import {PrintModel} from "../types/PrintModel";
import {API_MODELS, IMG_S3_URL} from "../configuration/Config";
import {PrintModelCard} from "../types/PrintModelCard";
import {PrintModelSuggest} from "../types/PrintModelSuggest";
import {SuggestionsResponse} from "../types/SuggestionsResponse";

// http://localhost:8081/archive/api/models
// ?page=0
// &size=1
// &sort=string
// &name=test
// &category=test
// &rate=5

// http://127.0.0.1:8081/
// http://127.0.0.1:9099/print-model-image/+M18

export async function getModelCard(id: String): Promise<PrintModel> {
    const requestUrl = API_MODELS + "/" + id
    console.log("before requestUrl - " + requestUrl)
    const input = await http.get(requestUrl) as PrintModelResponse
    console.log("after requestUrl - " + input.model.modelName)
    prepareModelImgUrls(input.model)
    return input.model
}

export async function fetchModelCards(
    page: number | undefined,
    size: number | undefined,
    sort: string | undefined = undefined,
    name: string | undefined = undefined,
    category: string | undefined = undefined,
    rate: string | undefined = undefined,
    nsfwOnly: boolean | undefined = undefined
): Promise<PrintModelsResponse> {
    const params = new URLSearchParams();
    if (page !== undefined) {
        params.append('page', (page - 1).toString());
    }
    if (size !== undefined) {
        params.append('size', size.toString());
    }
    if (sort !== undefined) {
        params.append('sort', sort);
    }
    if (name !== undefined) {
        params.append('name', name);
    }
    if (category !== undefined && category !== 'all') {
        params.append('category', category);
    }
    if (rate !== undefined && rate !== 'all') {
        params.append('rate', rate);
    }
    if (nsfwOnly !== undefined && nsfwOnly) {
        params.append('nsfwOnly', String(nsfwOnly));
    }
    const url = API_MODELS + "?" + params.toString();
    console.log("fetchModelCards url - " + url)
    const input = await http.get(url) as PrintModelsResponse
    prepareCardImgUrls(input.models)
    return input
}

export async function fetchSuggestionsModelCards(
    name: string | undefined = undefined,
): Promise<PrintModelsResponse> {
    const params = new URLSearchParams();
    if (name !== undefined) {
        params.append('name', name);
    }
    params.append('size', String(3));
    const url = API_MODELS + "?" + params.toString();
    console.log("fetchModelCards url - " + url)
    const input = await http.get(url) as PrintModelsResponse
    prepareCardImgUrls(input.models)
    return input
}

export async function fetchSuggestionsPrintModels(
    query: string,
): Promise<SuggestionsResponse> {
    const url = API_MODELS + "/suggestions/" + query;
    console.log("fetchModelCards url - " + url)
    const input = await http.get(url) as SuggestionsResponse
    prepareSuggestImgUrls(input.suggestions)
    return input
}

function prepareModelImgUrls(model: PrintModel) {
    model.preview = IMG_S3_URL + model?.preview;
    model.oths.forEach((oth) => {
        oth.preview = IMG_S3_URL + oth.preview;
    })
}

function prepareCardImgUrls(models: PrintModelCard[] | undefined) {
    models?.forEach((model) => {
        model.preview = IMG_S3_URL + model.preview;
    })
}

function prepareSuggestImgUrls(models: PrintModelSuggest[] | undefined) {
    models?.forEach((model) => {
        model.preview = IMG_S3_URL + model.preview;
    })
}
