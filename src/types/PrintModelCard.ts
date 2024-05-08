export interface PrintModelCard {
    id: string,
    preview: string,
    modelName: string,
    rate: number,
    nsfw: boolean,
    category: string,
    categories: string[],
    images: string[],
    addedAt: string
}