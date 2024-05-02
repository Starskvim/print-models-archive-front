export interface PrintModelCard {
    id: string,
    preview: string,
    modelName: string,
    rate: number,
    nsfw: boolean,
    images: string[],
    addedAt: string
}