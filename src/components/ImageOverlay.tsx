import Carousel from "react-bootstrap/Carousel";
import AsyncImage from "./AsyncImage";
import styled from "styled-components";

const ImageOverlay = (
    {
        additionalImageUrls, onBgClick, cachedImages
    }: {
        additionalImageUrls: string[], onBgClick: Function, cachedImages: { [url in string]: HTMLImageElement }
    }
) => {
    return (
        <OverlayContainer>
            <BackgroundOverlay onClick={() => onBgClick()} />
            <CarouselContainer>
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
            </CarouselContainer>
        </OverlayContainer>
    );
};

const OverlayContainer = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
`;

const BackgroundOverlay = styled.div<{ onClick?: () => void }>`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: ${({theme}) => theme.colors.black}80;
    backdrop-filter: blur(2px);
    cursor: pointer;
`;

const CarouselContainer = styled.div`
    position: absolute;
    width: 800px;
    height: 600px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: ${({theme}) => theme.colors.shadowSupport};
`;

export default ImageOverlay;