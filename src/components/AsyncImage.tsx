import {createRef, useEffect} from "react";
import {drawAndFill, fill} from '../utils/canvas';
import {default as AsyncImg} from '../classes/asyncImage';

const AsyncImage = (

    {
        src, width, height, cachedImages, className, bgColor, preloadBgColor
    }: {
        src: string | undefined,
        width: number,
        height: number,
        cachedImages: { [url in string]: HTMLImageElement },
        className?: string,
        bgColor?: string,
        preloadBgColor?: string
    }) => {

    const canvasRef = createRef<HTMLCanvasElement>();

    useEffect(() => {
        const canvas = canvasRef.current!;
        canvas.width = width;
        canvas.height = height;
        if (preloadBgColor) {
            fill(canvas, preloadBgColor);
        }

        if (!src) return;

        if (!cachedImages[src]) {
            const asyncImage = new AsyncImg(src, (img: HTMLImageElement, e: Event) => {
                cachedImages[src] = img;
                drawAndFill(canvas, cachedImages[src], bgColor);
            });
            return () => asyncImage.close();
        } else {
            drawAndFill(canvas, cachedImages[src], bgColor);
        }
    }, [src]);

    return (<canvas ref={canvasRef} className={className}></canvas>);
};

export default AsyncImage;