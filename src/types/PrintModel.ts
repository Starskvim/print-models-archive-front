export interface PrintModel {
    id: string,
    addedAt: string
    preview: string,
    modelName: string,
    rate: number,
    nsfw: boolean,
    categories: string[]
    oths: PrintModelOth[]
    zips: PrintModelZip[]
}

export interface PrintModelOth {
    preview: string
}

export interface PrintModelZip {
    fileName: string
    format: string
    size: string
}