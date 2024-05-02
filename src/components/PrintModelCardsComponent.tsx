import {PrintModelCard} from "../types/PrintModelCard";
import PrintModelCardComponent from "./PrintModelCardComponent";
import Pagination from "./Pagination";

const PrintModelCardsComponent = (
    {
        products,
        onProductClick,
        cachedImages,
        onPageChange // TODO add pagination info
    }: {
        products: PrintModelCard[],
        onProductClick: Function,
        cachedImages: { [url in string]: HTMLImageElement },
        onPageChange: Function
    }
) =>
    <div className="row">
        {products.map(product => (
            <div className="col my-3" key={product.id} onClick={() => onProductClick(product)}>
                <PrintModelCardComponent product={product} cachedImages={cachedImages}/>
            </div>
        ))}
        <div>
            <Pagination
                itemsCount={6}
                maxItemsPerPage={2}
                currentPage={1}
                onPageChange={onPageChange}
            />
        </div>
    </div>

export default PrintModelCardsComponent;