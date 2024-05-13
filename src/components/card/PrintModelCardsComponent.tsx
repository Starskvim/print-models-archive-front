import {PrintModelCard} from "../../types/PrintModelCard";
import PrintModelCardComponent from "./PrintModelCardComponent";
import PaginationComponent from "../PaginationComponent";
import {PAGE_SIZE} from "../../configuration/Config";
import React from "react";


interface PrintModelCardsComponentProps {
    products: PrintModelCard[];
    onPageChange: (page: number) => void; // More specific function type
    size: number;
    currentPage: number;
}

const PrintModelCardsComponent: React.FC<PrintModelCardsComponentProps> = (
    {
        products,
        onPageChange,
        size,
        currentPage
    }
) => {
    return (
        <div className="row">
            {products.map(product => (
                <div className="col my-3" key={product.id}>
                    <PrintModelCardComponent product={product}/>
                </div>
            ))}
            <div>
                <PaginationComponent
                    itemsCount={size}
                    maxItemsPerPage={PAGE_SIZE}
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
};


export default PrintModelCardsComponent;