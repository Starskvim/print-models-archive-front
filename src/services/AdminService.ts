import http from './ApiService';
import {API_ADMIN} from "../configuration/Config";

export async function createArchive() {
    const input = await http.post(API_ADMIN + "/create-archive")
    console.log("createArchive - " + input)
}

export async function updateArchive() {
    const input = await http.post(API_ADMIN + "/update-archive")
    console.log("update-archive - " + input)
}

export async function clearArchive() {
    const input = await http.del(API_ADMIN + "/clear-archive")
    console.log("clearArchive - " + input)
}

export async function checkFolders() {
    const input = await http.get(API_ADMIN + "/check-folders")
    console.log("checkFolders - " + input)
}

export async function recreateS3() {
    const input = await http.put(API_ADMIN + "/recreate-bucket")
    console.log("recreate-bucket - " + input)
}