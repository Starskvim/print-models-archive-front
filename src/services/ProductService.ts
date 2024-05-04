import http from './ApiService';
import { PrintModelsResponse } from '../types/PrintModelsResponse';
import {PrintModelResponse} from "../types/PrintModelResponse";
import {PrintModel} from "../types/PrintModel";
import {API_MODELS} from "../configuration/Config";

// http://localhost:8081/archive/api/models
// ?page=0
// &size=1
// &sort=string
// &name=test
// &category=test
// &rate=5

export async function getModelCard(id: String): Promise<PrintModel> {
  const requestUrl = API_MODELS + "/" + id
  console.log("before requestUrl - " + requestUrl)
  const input = await http.get(requestUrl) as PrintModelResponse
  console.log("after requestUrl - " + input.model.modelName)
  return input.model
}

export async function fetchModelCards(
    page: string | undefined,
    size: string | undefined,
    sort: string | undefined,
    name: string | undefined,
    category: string | undefined,
    rate : string | undefined
): Promise<PrintModelsResponse> {
  const params = new URLSearchParams();
  if (page != undefined) {
    params.append('page', page);
  }
  if (size != undefined) {
    params.append('size', size);
  }
  if (sort != undefined) {
    params.append('sort', sort);
  }
  if (name != undefined) {
    params.append('name', name);
  }
  if (category != undefined) {
    params.append('category', category);
  }
  if (rate != undefined && rate !== 'all') {
    params.append('rate', rate);
  }
  const url = API_MODELS + "?" + params.toString();
  console.log("fetchModelCards url - " + url)
  const input = await http.get(url) as PrintModelsResponse
  return input
}
