import http from './ApiService';
import {API_ADMIN} from "../configuration/Config";

export async function createArchive() {
    const input = await http.post(API_ADMIN + "/create-archive")
    console.log("createArchive - " + input)
}

export async function clearArchive() {
    const input = await http.del(API_ADMIN + "/clear-archive")
    console.log("clearArchive - " + input)
}

export async function checkFolders() {
    const input = await http.get(API_ADMIN + "/check-folders")
    console.log("checkFolders - " + input)
}