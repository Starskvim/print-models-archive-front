import React from "react";
import styled from "styled-components";

const SkeletonCard = () => (
    <CardStyled>
        <div className="skeleton-img"/>
        <div className="card-body">
            <div className="skeleton-line skeleton-title"/>
            <div className="skeleton-line"/>
            <div className="skeleton-line short"/>
        </div>
    </CardStyled>
);

const CardStyled = styled.div`
    width: 300px;
    margin: auto;
    background-color: ${({theme}) => theme.colors.card_bg};
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: 8px;
    box-shadow: ${({theme}) => theme.colors.shadowSupport};
    overflow: hidden;

    .skeleton-img {
        width: 100%;
        height: 300px;
        background-color: ${({theme}) => theme.colors.skeleton};
        animation: skeleton-pulse 1.5s ease-in-out infinite;
    }

    .card-body {
        padding: 16px;
    }

    .skeleton-line {
        height: 12px;
        border-radius: 4px;
        margin-bottom: 8px;
        background-color: ${({theme}) => theme.colors.skeleton};
        animation: skeleton-pulse 1.5s ease-in-out infinite;
    }

    .skeleton-title {
        height: 20px;
        width: 70%;
        margin-bottom: 12px;
    }

    .short {
        width: 50%;
    }

    @keyframes skeleton-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
    }
`;

export default SkeletonCard;
