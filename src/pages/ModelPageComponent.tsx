import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {getModelCard} from "../services/ProductService";
import PrintModelComponent from "../components/card/PrintModelComponent";
import AsyncImage from "../components/AsyncImage";
import {Helmet} from "react-helmet";
import {useParams} from "react-router-dom";
import {useAppContext} from "../state/AppContext";

const ModelPageComponent: React.FC = () => {

    const {id} = useParams<{ id: string }>();
    const {globalState, updateGlobalState} = useAppContext();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            const productData = await getModelCard(id!!);
            console.log('Product from getCard:', productData);
            updateGlobalState({
                product: productData
            })
        };
        fetchProduct();
    }, [id]);

    // Combine preview image with other images for the slider, avoiding duplicates
    const getAllImages = () => {
        if (!globalState.product) return [];
        const product = globalState.product;
        const images = [product.preview];
        if (product.oths) {
            // Filter out any images that match the main preview to avoid duplicates
            const uniqueOthImages = product.oths
                .map(oth => oth.preview)
                .filter(othPreview => othPreview !== product.preview);
            images.push(...uniqueOthImages);
        }
        return images;
    };

    const allImages = getAllImages();

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    const goToImage = (index: number) => {
        setCurrentImageIndex(index);
    };

    console.log("render ModelPage product - " + JSON.stringify(globalState.product));

    return (
        <ModelPageStyled>
            <Helmet>
                <title>{globalState.product?.modelName}</title>
            </Helmet>
            <div>
                {/* Image Slider */}
                {globalState.product && allImages.length > 0 && (
                    <div className="image-slider">
                        <div className="slider-container">
                            <AsyncImage
                                src={allImages[currentImageIndex]}
                                className="slider-image"
                                width={600}
                                height={400}
                                cachedImages={{}}
                                bgColor={'hsl(0, 0%, 100%)'}
                                preloadBgColor={'hsl(0, 0%, 75%)'}
                            />
                            
                            {/* Navigation arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button className="slider-btn prev-btn" onClick={prevImage}>
                                        &#8249;
                                    </button>
                                    <button className="slider-btn next-btn" onClick={nextImage}>
                                        &#8250;
                                    </button>
                                </>
                            )}
                        </div>
                        
                        {/* Image indicators */}
                        {allImages.length > 1 && (
                            <div className="slider-indicators">
                                {allImages.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                                        onClick={() => goToImage(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
                
                {/* Product details without the main image */}
                <div className="col my-3">
                    {globalState.product ? <PrintModelComponent product={globalState.product}/> : <p>Error</p>}
                </div>
            </div>
        </ModelPageStyled>
    );
};

export default ModelPageComponent;

const ModelPageStyled = styled.section`
    .image-slider {
        width: 600px;
        margin: 30px auto;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        overflow: hidden;
        background: #ffffff;
    }

    .slider-container {
        position: relative;
        width: 100%;
        height: 400px;
        overflow: hidden;
    }

    .slider-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }

    .slider-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        font-size: 24px;
        padding: 10px 15px;
        cursor: pointer;
        border-radius: 4px;
        transition: background 0.3s ease;
        z-index: 10;
    }

    .slider-btn:hover {
        background: rgba(0, 0, 0, 0.7);
    }

    .prev-btn {
        left: 10px;
    }

    .next-btn {
        right: 10px;
    }

    .slider-indicators {
        display: flex;
        justify-content: center;
        gap: 8px;
        padding: 15px;
        background: #ffffff;
    }

    .indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: none;
        background: #ddd;
        cursor: pointer;
        transition: background 0.3s ease;
    }

    .indicator.active {
        background: #2980b9;
    }

    .indicator:hover {
        background: #3498db;
    }

    @media (max-width: ${({theme}) => theme.media.mobile}) {
        padding: 0 2.4rem;
        
        .image-slider {
            width: 100%;
            margin: 20px auto;
        }
        
        .slider-container {
            height: 300px;
        }
        
        .slider-btn {
            font-size: 20px;
            padding: 8px 12px;
        }
    }
`;