import Carousel from "react-bootstrap/Carousel";
import AsyncImage from "./AsyncImage";

const ImageOverlay = ({additionalImageUrls, onBgClick, cachedImages}: {additionalImageUrls: string[], onBgClick: Function, cachedImages: { [url in string]: HTMLImageElement }}) => {
  return (<div
    style={{position: 'fixed', width: '100%', height: '100%', top: 0, bottom: 0, left: 0, right: 0}}
  >
    <div
      style={{position: 'fixed', width: '100%', height: '100%', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'hsla(0, 0%, 50%, .5)'}}
      onClick={() => onBgClick()}
    ></div>
    <div
      style={{position: 'absolute', width: '800px', height: '600px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}
    >
      <Carousel>
        {additionalImageUrls.map((url: string) =>
          <Carousel.Item key={url}>
            <AsyncImage
              src={url}
              width={800}
              height={600}
              cachedImages={cachedImages}
            />
          </Carousel.Item>
        )}
      </Carousel>
    </div>
  </div>)};

export default ImageOverlay;