import * as process from "process";

export interface Env {
    REACT_APP_API_ARCHIVE: string;
    REACT_APP_API_MODELS_URL: string;
    REACT_APP_API_ADMIN_URL: string;
    REACT_APP_PAGE_SIZE: number
    REACT_APP_IMG_S3_URL: string;
}

declare global {
    namespace NodeJS {
        interface ProcessEnv extends Env {}
    }
}

// const env: Env = process.env as any;

export const API_MODELS = process.env.REACT_APP_API_MODELS_URL;

export const API_ADMIN = process.env.REACT_APP_API_ADMIN_URL;

export const PAGE_SIZE = process.env.REACT_APP_PAGE_SIZE

export const IMG_S3_URL = process.env.REACT_APP_IMG_S3_URL

export const API_ARCHIVE = process.env.REACT_APP_API_ARCHIVE
