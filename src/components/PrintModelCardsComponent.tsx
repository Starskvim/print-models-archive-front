import {PrintModelCard} from "../types/PrintModelCard";
import PrintModelCardComponent from "./PrintModelCardComponent";
import Pagination from "./Pagination";
import {PageState} from "../types/state";

export const DEFAULT_PAGE_SIZE = 2

const PrintModelCardsComponent = (
    {
        products,
        onProductClick,
        cachedImages,
        onPageChange,
        pageState
    }: {
        products: PrintModelCard[],
        onProductClick: Function,
        cachedImages: { [url in string]: HTMLImageElement },
        onPageChange: Function,
        pageState: PageState
    }
) =>
    <div className="row">
        {
            products?.map(product => (
                    <div className="col my-3" key={product.id} onClick={() => onProductClick(product)}>
                        <PrintModelCardComponent product={product} cachedImages={cachedImages}/>
                    </div>
                )
            )
        }
        <div>
            <Pagination
                itemsCount={pageState.size}
                maxItemsPerPage={DEFAULT_PAGE_SIZE}
                currentPage={pageState.currentPage}
                onPageChange={onPageChange}
            />
        </div>
    </div>

export default PrintModelCardsComponent;