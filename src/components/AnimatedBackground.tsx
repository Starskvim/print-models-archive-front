import React from "react";
import styled from "styled-components";

// "Build plate" backdrop: a faint grid drifting diagonally plus soft glows
// wandering underneath. Fixed behind all content; frozen for reduced motion.
const AnimatedBackground: React.FC = () => (
    <BackgroundStyled aria-hidden="true">
        <div className="bg-glow bg-glow-1"/>
        <div className="bg-glow bg-glow-2"/>
        <div className="bg-glow bg-glow-3"/>
        <div className="bg-grid"/>
    </BackgroundStyled>
);

const GRID_STEP = 48;

const BackgroundStyled = styled.div<{ 'aria-hidden': 'true'; children?: React.ReactNode }>`
    position: fixed;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;

    .bg-grid {
        position: absolute;
        inset: -${GRID_STEP}px;
        background-image:
            linear-gradient(to right, ${({theme}) => theme.colors.bg_grid} 1px, transparent 1px),
            linear-gradient(to bottom, ${({theme}) => theme.colors.bg_grid} 1px, transparent 1px);
        background-size: ${GRID_STEP}px ${GRID_STEP}px;
        mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, #000 35%, transparent 100%);
        -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, #000 35%, transparent 100%);
        animation: bg-grid-drift 14s linear infinite;
        will-change: transform;
    }

    .bg-glow {
        position: absolute;
        border-radius: 50%;
        will-change: transform;
    }

    .bg-glow-1 {
        top: -25vmax;
        left: -15vmax;
        width: 70vmax;
        height: 70vmax;
        background: radial-gradient(circle, ${({theme}) => theme.colors.bg_glow_1} 0%, transparent 65%);
        animation: bg-glow-a 48s ease-in-out infinite alternate;
    }

    .bg-glow-2 {
        bottom: -30vmax;
        right: -20vmax;
        width: 75vmax;
        height: 75vmax;
        background: radial-gradient(circle, ${({theme}) => theme.colors.bg_glow_2} 0%, transparent 65%);
        animation: bg-glow-b 60s ease-in-out infinite alternate;
    }

    .bg-glow-3 {
        top: 30%;
        left: 40%;
        width: 45vmax;
        height: 45vmax;
        background: radial-gradient(circle, ${({theme}) => theme.colors.bg_glow_2} 0%, transparent 65%);
        animation: bg-glow-c 38s ease-in-out infinite alternate;
    }

    @keyframes bg-grid-drift {
        to {
            transform: translate(${GRID_STEP}px, ${GRID_STEP}px);
        }
    }

    @keyframes bg-glow-a {
        to {
            transform: translate(45vw, 35vh);
        }
    }

    @keyframes bg-glow-b {
        to {
            transform: translate(-40vw, -30vh);
        }
    }

    @keyframes bg-glow-c {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
        }
        100% {
            transform: translate(-30vw, -20vh) scale(1.3);
            opacity: 1;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .bg-grid,
        .bg-glow {
            animation: none;
        }
    }
`;

export default AnimatedBackground;
