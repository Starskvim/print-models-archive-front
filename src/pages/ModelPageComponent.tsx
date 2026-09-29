import React, {useEffect, useState} from "react";
import styled, {useTheme} from "styled-components";
import {Link, useParams} from "react-router-dom";
import {getModelCard} from "../services/ProductService";
import PrintModelComponent from "../components/card/PrintModelComponent";
import AsyncImage from "../components/AsyncImage";
import SkeletonCard from "../components/card/SkeletonCard";
import ErrorBlock from "../components/ErrorBlock";
import {useAppContext} from "../state/AppContext";

type LoadStatus = "loading" | "ready" | "error";

const ModelPageComponent: React.FC = () => {

    const {id} = useParams<{ id: string }>();
    const theme = useTheme();
    const {globalState, updateGlobalState} = useAppContext();

    const [status, setStatus] = useState<LoadStatus>("loading");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [retryTick, setRetryTick] = useState(0);

    useEffect(() => {
        let cancelled = false;
        setStatus("loading");
        setCurrentImageIndex(0);

        const fetchProduct = async () => {
            try {
                const productData = await getModelCard(id!!);
                if (cancelled) return;
                updateGlobalState({product: productData});
                setStatus("ready");
            } catch (error) {
                if (cancelled) return;
                setStatus("error");
            }
        };

        fetchProduct();

        return () => {
            cancelled = true;
        };
    }, [id, retryTick]);

    const modelName = status === "ready" ? globalState.product?.modelName : undefined;
    useEffect(() => {
        if (!modelName) return;
        const previousTitle = document.title;
        document.title = modelName;
        return () => {
            document.title = previousTitle;
        };
    }, [modelName]);

    const getAllImages = () => {
        if (!globalState.product) return [];
        const product = globalState.product;
        const images = [product.preview];
        if (product.oths) {
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

    const handleRetry = () => {
        setRetryTick((tick) => tick + 1);
    };

    return (
        <ModelPageStyled>
            {status === "loading" && (
                <>
                    <div data-testid="slider-skeleton" className="slider-skeleton"/>
                    <div className="col my-3">
                        <SkeletonCard/>
                    </div>
                </>
            )}
            {status === "error" && (
                <ErrorBlock>
                    <p>Failed to load model. This could be because the model is unavailable, the link is broken, or there was a problem with the server.</p>
                    <button onClick={handleRetry}>Try again</button>
                    <Link to="/">← Catalog</Link>
                </ErrorBlock>
            )}
            {status === "ready" && globalState.product && (
                <>
                    {allImages.length > 0 && (
                        <div className="image-slider">
                            <div className="slider-container">
                                <AsyncImage
                                    src={allImages[currentImageIndex]}
                                    className="slider-image"
                                    width={600}
                                    height={400}
                                    cachedImages={{}}
                                    bgColor={theme.colors.card_bg}
                                    preloadBgColor={theme.colors.card_bg}
                                />
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
                    <div className="col my-3">
                        <PrintModelComponent product={globalState.product}/>
                    </div>
                </>
            )}
        </ModelPageStyled>
    );
};

export default ModelPageComponent;

const ModelPageStyled = styled.section`
    .slider-skeleton {
        width: 100%;
        max-width: 600px;
        height: 400px;
        margin: 30px auto;
        border-radius: 8px;
        overflow: hidden;
        background-color: ${({theme}) => theme.colors.skeleton};
        animation: skeleton-pulse 1.5s ease-in-out infinite;
    }

    .image-slider {
        width: 100%;
        max-width: 600px;
        margin: 30px auto;
        box-shadow: ${({theme}) => theme.colors.shadowSupport};
        border-radius: 8px;
        overflow: hidden;
        background: ${({theme}) => theme.colors.card_bg};
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
        color: #fff;
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
        background: ${({theme}) => theme.colors.card_bg};
    }

    .indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: none;
        background: ${({theme}) => theme.colors.btn};
        opacity: 0.25;
        cursor: pointer;
        transition: opacity 0.3s ease;
    }

    .indicator.active {
        opacity: 1;
    }

    .indicator:hover:not(.active) {
        opacity: 0.5;
    }

    @media (max-width: 768px) {
        padding: 0 2.4rem;

        .image-slider,
        .slider-skeleton {
            margin: 20px auto;
        }

        .slider-skeleton,
        .slider-container {
            height: 300px;
        }

        .slider-btn {
            font-size: 20px;
            padding: 8px 12px;
        }
    }

    @keyframes skeleton-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
    }
`;
