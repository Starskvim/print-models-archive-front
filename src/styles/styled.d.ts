import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            heading: string;
            text: string;
            white: string;
            black: string;
            helper: string;

            bg: string;
            card_bg: string;
            input_bg: string;
            footer_bg: string;
            header_bg: string;
            btn: string;
            border: string;
            hr: string;
            gradient: string;
            shadow: string;
            shadowSupport: string;
        },
        media: {
            mobile: string;
            tab: string;
        }
    }
}