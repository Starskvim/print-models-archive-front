import React, {useEffect, useRef, useState} from "react";
import styled, {createGlobalStyle, useTheme} from "styled-components";

// Hotend cursor: the nozzle tip is the hotspot, it extrudes a glowing filament
// that cools down to the theme color, and a click drops a molten splash.
// Mouse only; off for touch devices and prefers-reduced-motion.

const TRAIL_MS = 800;
const SPLASH_MS = 650;
const NATIVE_CURSOR_SELECTOR = "input, textarea, select, [contenteditable='true']";
const CLICKABLE_SELECTOR = "a, button, [role='button'], label";

type Rgb = [number, number, number];

interface TrailPoint {
    x: number;
    y: number;
    t: number;
}

interface Droplet {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
}

interface Splash {
    x: number;
    y: number;
    t: number;
    droplets: Droplet[];
}

const HOT: Rgb = [255, 243, 196];
const WARM: Rgb = [255, 154, 61];

const mix = (a: Rgb, b: Rgb, k: number): Rgb =>
    [0, 1, 2].map(i => Math.round(a[i] + (b[i] - a[i]) * k)) as Rgb;

const rgba = (c: Rgb, alpha: number) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})`;

// Filament color by age (0 = just extruded, 1 = gone): hot -> warm -> theme color
const filamentColor = (age: number, cool: Rgb): Rgb =>
    age < 0.15 ? mix(HOT, WARM, age / 0.15) : mix(WARM, cool, Math.min(1, (age - 0.15) / 0.35));

// Let the browser normalize any CSS color ("rgb(98 84 243)", "#abc", ...) to rgb numbers
function parseColor(ctx: CanvasRenderingContext2D, color: string): Rgb {
    ctx.fillStyle = "#000";
    ctx.fillStyle = color;
    const normalized = String(ctx.fillStyle);
    if (normalized.startsWith("#")) {
        const n = parseInt(normalized.slice(1), 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    const parts = normalized.match(/[\d.]+/g) || ["0", "0", "0"];
    return [Number(parts[0]), Number(parts[1]), Number(parts[2])];
}

function isEnabled() {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return window.matchMedia("(pointer: fine)").matches
        && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function drawNozzle(ctx: CanvasRenderingContext2D, x: number, y: number, tilt: number, hot: boolean) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);

    // Glow at the tip
    const glowR = hot ? 13 : 8;
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, glowR);
    glow.addColorStop(0, "rgba(255, 243, 196, 0.95)");
    glow.addColorStop(0.4, "rgba(255, 154, 61, 0.55)");
    glow.addColorStop(1, "rgba(255, 154, 61, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, glowR, 0, Math.PI * 2);
    ctx.fill();

    // Brass nozzle tip (hotspot at 0,0)
    ctx.fillStyle = "#e0a84a";
    ctx.beginPath();
    ctx.moveTo(-4, -7);
    ctx.lineTo(4, -7);
    ctx.lineTo(1.2, -1);
    ctx.lineTo(-1.2, -1);
    ctx.closePath();
    ctx.fill();

    // Heater block
    ctx.fillStyle = "#c9ced6";
    ctx.fillRect(-7, -16, 14, 9);
    ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
    ctx.fillRect(-7, -9, 14, 2);

    // Heatsink / fan shroud
    ctx.fillStyle = "#4b515c";
    ctx.fillRect(-9, -24, 18, 8);
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    for (let i = -6; i <= 6; i += 4) ctx.fillRect(i, -23, 1.5, 6);

    ctx.restore();
}

const NozzleCursor: React.FC = () => {
    const [enabled, setEnabled] = useState(isEnabled);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const theme = useTheme();
    const coolColorRef = useRef<Rgb>([98, 84, 243]);

    useEffect(() => {
        if (typeof window.matchMedia !== "function") return;
        const queries = [window.matchMedia("(pointer: fine)"), window.matchMedia("(prefers-reduced-motion: reduce)")];
        const update = () => setEnabled(isEnabled());
        queries.forEach(q => q.addEventListener?.("change", update));
        return () => queries.forEach(q => q.removeEventListener?.("change", update));
    }, []);

    useEffect(() => {
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) coolColorRef.current = parseColor(ctx, theme.colors.btn);
    }, [theme, enabled]);

    useEffect(() => {
        if (!enabled) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const trail: TrailPoint[] = [];
        const splashes: Splash[] = [];
        const pointer = {x: -100, y: -100, visible: false, native: false, hot: false, tilt: 0};
        let frame = 0;
        let lastFrame = 0;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            schedule();
        };

        const render = (now: number) => {
            frame = 0;
            const dt = lastFrame ? Math.min(50, now - lastFrame) : 16;
            lastFrame = now;
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            const cool = coolColorRef.current;

            while (trail.length && now - trail[0].t > TRAIL_MS) trail.shift();
            // Butt caps: round caps overlap at the joints and show up as beads
            ctx.lineCap = "butt";
            ctx.lineJoin = "round";
            for (let i = 1; i < trail.length; i++) {
                const age = (now - trail[i].t) / TRAIL_MS;
                ctx.strokeStyle = rgba(filamentColor(age, cool), 1 - age);
                ctx.lineWidth = 3.2 * (1 - age * 0.5);
                ctx.beginPath();
                ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
                ctx.lineTo(trail[i].x, trail[i].y);
                ctx.stroke();
            }

            for (let i = splashes.length - 1; i >= 0; i--) {
                const s = splashes[i];
                const age = (now - s.t) / SPLASH_MS;
                if (age >= 1) {
                    splashes.splice(i, 1);
                    continue;
                }
                const color = filamentColor(age, cool);
                ctx.fillStyle = rgba(color, 1 - age);
                ctx.beginPath();
                ctx.arc(s.x, s.y, 3 + 9 * Math.sqrt(age), 0, Math.PI * 2);
                ctx.fill();
                s.droplets.forEach(d => {
                    d.x += d.vx * dt / 16;
                    d.y += d.vy * dt / 16;
                    d.vy += 0.35 * dt / 16;
                    ctx.beginPath();
                    ctx.arc(d.x, d.y, d.r * (1 - age * 0.6), 0, Math.PI * 2);
                    ctx.fill();
                });
            }

            // Ease the tilt back to upright when the mouse stops
            pointer.tilt *= 0.85;
            if (pointer.visible && !pointer.native) {
                drawNozzle(ctx, pointer.x, pointer.y, pointer.tilt, pointer.hot);
            }

            if (trail.length > 1 || splashes.length || Math.abs(pointer.tilt) > 0.005) schedule();
            else lastFrame = 0;
        };

        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(render);
        };

        const onMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            const target = e.target as Element | null;
            pointer.native = !!target?.closest?.(NATIVE_CURSOR_SELECTOR);
            pointer.hot = !!target?.closest?.(CLICKABLE_SELECTOR);
            const dx = e.clientX - pointer.x;
            if (pointer.visible) {
                pointer.tilt = Math.max(-0.4, Math.min(0.4, pointer.tilt + dx * 0.01));
            }
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            pointer.visible = true;
            if (!pointer.native) trail.push({x: e.clientX, y: e.clientY, t: performance.now()});
            if (trail.length > 120) trail.shift();
            schedule();
        };

        const onDown = (e: PointerEvent) => {
            if (e.pointerType !== "mouse" || pointer.native) return;
            const droplets: Droplet[] = Array.from({length: 7}, (_, i) => {
                const angle = (Math.PI * 2 * i) / 7 + Math.random() * 0.6;
                const speed = 1.6 + Math.random() * 1.8;
                return {x: e.clientX, y: e.clientY, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 1.2, r: 1.4 + Math.random() * 1.6};
            });
            splashes.push({x: e.clientX, y: e.clientY, t: performance.now(), droplets});
            schedule();
        };

        const onLeave = () => {
            pointer.visible = false;
            schedule();
        };

        resize();
        window.addEventListener("resize", resize);
        window.addEventListener("pointermove", onMove, {passive: true});
        window.addEventListener("pointerdown", onDown, {passive: true});
        document.documentElement.addEventListener("mouseleave", onLeave);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", resize);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerdown", onDown);
            document.documentElement.removeEventListener("mouseleave", onLeave);
        };
    }, [enabled]);

    if (!enabled) return null;

    return (
        <>
            <HideNativeCursor/>
            <CanvasStyled>
                <canvas ref={canvasRef} data-testid="nozzle-cursor" aria-hidden="true"/>
            </CanvasStyled>
        </>
    );
};

const HideNativeCursor = createGlobalStyle`
    html, body, * {
        cursor: none !important;
    }

    input, textarea, [contenteditable='true'] {
        cursor: text !important;
    }

    select {
        cursor: pointer !important;
    }
`;

const CanvasStyled = styled.div<{ children?: React.ReactNode }>`
    canvas {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        pointer-events: none;
    }
`;

export default NozzleCursor;
