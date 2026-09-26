import http from './ApiService';
import {API_ADMIN} from "../configuration/Config";

export async function createArchive() {
    await http.post(API_ADMIN + "/create-archive")
}

export async function updateArchive() {
    await http.post(API_ADMIN + "/update-archive")
}

export async function clearArchive() {
    await http.del(API_ADMIN + "/clear-archive")
}

export async function checkFolders() {
    await http.get(API_ADMIN + "/check-folders")
}

export async function recreateS3() {
    await http.put(API_ADMIN + "/recreate-bucket")
}
