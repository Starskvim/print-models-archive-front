export interface Catalog {
    catalog: Category[]
    categories: Category[]
}

export interface Category {
    name: string;
    size: number;
    level: number;
    children: Category[];
}