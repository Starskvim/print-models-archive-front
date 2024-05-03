import http from './ApiService';

const API_ADMIN = "http://localhost:8081/archive/api/admin"

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