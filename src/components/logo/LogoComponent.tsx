import React, {useState} from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";

// Wordmark that "prints" itself layer by layer: the text is revealed bottom-up in
// LAYERS steps while a nozzle sweeps along the current layer. Hover reprints it.
const LAYERS = 12;
const PRINT_MS = 2400;
const SWEEP_MS = 100;

const LogoComponent: React.FC = () => {
    const [printRun, setPrintRun] = useState(0);
    const [printing, setPrinting] = useState(true);

    const reprint = () => {
        if (printing) return;
        setPrinting(true);
        setPrintRun(run => run + 1);
    };

    return (
        <Styled>
            <Link to="/" className="logo" aria-label="PrintModelArchive — home" onMouseEnter={reprint}>
                <span className="print-area" key={printRun}>
                    <span className="wordmark" aria-hidden="true">PRINT MODEL</span>
                    <span className="nozzle-track" onAnimationEnd={e => {
                        if (e.animationName === 'logo-nozzle-park') setPrinting(false);
                    }}>
                        <span className="hot-layer"/>
                        <span className="nozzle">
                            <svg viewBox="0 0 14 18" aria-hidden="true">
                                <rect className="nozzle-fan" x="0" y="0" width="14" height="5" rx="1"/>
                                <rect className="nozzle-block" x="2" y="5" width="10" height="7" rx="1"/>
                                <path className="nozzle-tip" d="M4 12 H10 L7.6 16.5 H6.4 Z"/>
                            </svg>
                            <span className="nozzle-glow"/>
                        </span>
                    </span>
                </span>
                <span className="subtitle" aria-hidden="true" key={`sub-${printRun}`}>
                    {'ARCHIVE'.split('').map((letter, i) => <span key={i}>{letter}</span>)}
                </span>
            </Link>
        </Styled>
    );
};

export default LogoComponent;

const Styled = styled.div<{ children?: React.ReactNode }>`
    display: flex;
    align-items: center;

    .logo {
        display: inline-flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
        text-decoration: none;
        color: ${({theme}) => theme.colors.white};
        padding-top: 14px; /* room for the nozzle above the first layer */
    }

    .logo:focus-visible {
        outline: 2px solid ${({theme}) => theme.colors.white};
        outline-offset: 4px;
        border-radius: 4px;
    }

    .print-area {
        position: relative;
        display: block;
    }

    .wordmark {
        display: block;
        font-size: 2.6rem;
        font-weight: 800;
        line-height: 1;
        letter-spacing: 0.04em;
        white-space: nowrap;
        /* Visible layer lines across the letters */
        background: repeating-linear-gradient(
            to bottom,
            currentColor 0,
            currentColor 2.4px,
            rgba(255, 255, 255, 0.55) 2.4px,
            rgba(255, 255, 255, 0.55) 3px
        );
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: logo-print ${PRINT_MS}ms steps(${LAYERS}, end) both;
    }

    /* Nozzle rides the top edge of the printed part */
    .nozzle-track {
        position: absolute;
        left: 0;
        right: 0;
        top: 100%;
        height: 0;
        animation:
            logo-nozzle-rise ${PRINT_MS}ms steps(${LAYERS}, end) both,
            logo-nozzle-park 500ms ease-in ${PRINT_MS}ms both;
    }

    .hot-layer {
        position: absolute;
        left: 0;
        right: 0;
        top: -1px;
        height: 2px;
        border-radius: 1px;
        background: linear-gradient(90deg, transparent, #ffb14a 20%, #ff7a3d 50%, #ffb14a 80%, transparent);
        box-shadow: 0 0 6px #ff9a3d;
        opacity: 0.85;
    }

    .nozzle {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 14px;
        height: 18px;
        margin-left: -7px;
        animation: logo-nozzle-sweep ${SWEEP_MS}ms ease-in-out ${(PRINT_MS / SWEEP_MS)} alternate both;
    }

    .nozzle svg {
        display: block;
        width: 100%;
        height: 100%;
    }

    .nozzle-fan {
        fill: #5b6270;
    }

    .nozzle-block {
        fill: #c9ced6;
    }

    .nozzle-tip {
        fill: #e0a84a;
    }

    .nozzle-glow {
        position: absolute;
        left: 50%;
        bottom: -3px;
        width: 8px;
        height: 8px;
        margin-left: -4px;
        border-radius: 50%;
        background: radial-gradient(circle, #fff3c4 0%, #ff9a3d 45%, transparent 70%);
        animation: logo-glow-pulse 400ms ease-in-out infinite alternate;
    }

    .subtitle {
        /* Letters spread across the full wordmark width */
        display: flex;
        justify-content: space-between;
        align-self: stretch;
        font-size: 1.2rem;
        font-weight: 600;
        line-height: 1;
        opacity: 0.8;
        animation: logo-fade-in 500ms ease-out ${PRINT_MS}ms both;
    }

    @keyframes logo-print {
        from {
            clip-path: inset(100% 0 0 0);
        }
        to {
            clip-path: inset(0 0 0 0);
        }
    }

    @keyframes logo-nozzle-rise {
        from {
            top: 100%;
        }
        to {
            top: 0;
        }
    }

    @keyframes logo-nozzle-park {
        to {
            transform: translate(-12px, -10px);
            opacity: 0;
        }
    }

    @keyframes logo-nozzle-sweep {
        from {
            left: 0;
        }
        to {
            left: 100%;
        }
    }

    @keyframes logo-glow-pulse {
        from {
            opacity: 0.6;
            transform: scale(0.85);
        }
        to {
            opacity: 1;
            transform: scale(1.15);
        }
    }

    @keyframes logo-fade-in {
        from {
            opacity: 0;
            transform: translateY(-3px);
        }
        to {
            opacity: 0.8;
            transform: none;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .wordmark,
        .subtitle {
            animation: none;
        }

        .nozzle-track {
            display: none;
        }
    }
`;
