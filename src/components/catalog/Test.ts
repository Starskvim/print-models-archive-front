export interface Category {
    id: number;
    name: string;
    children?: Category[];
}

export const categories: Category[] = [
    {
        id: 1,
        name: "Electronics",
        children: [
            { id: 2, name: "Laptops" },
            { id: 3, name: "Phones", children: [
                    { id: 4, name: "Smartphones" },
                    { id: 5, name: "Basic Phones" }
                ]},
            { id: 6, name: "Cameras" }
        ]
    },
    {
        id: 7,
        name: "Clothing",
        children: [
            { id: 8, name: "Men's Clothing" },
            { id: 9, name: "Women's Clothing" }
        ]
    }
];