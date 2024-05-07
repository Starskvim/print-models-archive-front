import http from './ApiService';

import {Catalog} from "../types/catalog/Catalog";
import {API_ARCHIVE} from "../configuration/Config";

export async function getCatalog(): Promise<Catalog> {
    const requestUrl = API_ARCHIVE + "/catalog"
    return await http.get(requestUrl) as Catalog
}