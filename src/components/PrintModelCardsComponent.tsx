import { PrintModelCard }  from "../types/PrintModelCard";
import PrintModelCardComponent from "./PrintModelCardComponent";

const PrintModelCardsComponent = (
    {products, onProductClick, cachedImages}: {products: PrintModelCard[], onProductClick: Function, cachedImages: { [url in string]: HTMLImageElement }}
) =>
  <div className="row">
    {products.map(product => (
      <div className="col my-3" key={product.id} onClick={() => onProductClick(product)}>
        <PrintModelCardComponent product={product} cachedImages={cachedImages} />
      </div>
    ))}
  </div>;

export default PrintModelCardsComponent;