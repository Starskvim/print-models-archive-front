import {DefaultTheme} from "styled-components";

export const lightTheme: DefaultTheme = {
    colors: {
        heading: "rgb(24 24 29)",
        text: "rgba(29 ,29, 29, .8)",
        white: "#fff",
        black: " #212529",
        helper: "#8490ff",

        bg: "#F6F8FA",
        card_bg: "#ffffff",
        input_bg: "#ffffff",
        footer_bg: "#6d96ea",
        header_bg: "#6d96ea",
        btn: "rgb(98 84 243)",
        border: "rgba(98, 84, 243, 0.5)",
        hr: "#ffffff",
        gradient:
            "linear-gradient(0deg, rgb(132 144 255) 0%, rgb(98 189 252) 100%)",
        shadow:
            "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;",
        shadowSupport: " rgba(0, 0, 0, 0.16) 0px 1px 4px",
    },
    media: {
        mobile: "768px",
        tab: "998px",
    },
};

export const darkTheme: DefaultTheme = {
    colors: {
        heading: "#ffffff",
        text: "#e0e0e0",
        white: "#e0e0e0",
        black: "#ffffff",
        helper: "#9ca3ff",

        bg: "#1a1a1a",
        card_bg: "#2d2d2d",
        input_bg: "#333333",
        footer_bg: "#2d2d2d",
        header_bg: "#2d2d2d",
        btn: "rgb(120 104 255)",
        border: "rgba(120, 104, 255, 0.6)",
        hr: "#4a4a4a",
        gradient:
            "linear-gradient(0deg, rgb(150 160 255) 0%, rgb(120 200 255) 100%)",
        shadow:
            "rgba(0, 0, 0, 0.3) 0px 2px 8px 0px, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px;",
        shadowSupport: "rgba(0, 0, 0, 0.4) 0px 2px 8px",
    },
    media: {
        mobile: "768px",
        tab: "998px",
    },
};

// Default export for backward compatibility
const theme = lightTheme;
export default theme;