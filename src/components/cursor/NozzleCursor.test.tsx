import React from "react";
import {render, screen} from "@testing-library/react";
import {ThemeProvider as StyledThemeProvider} from "styled-components";
import {lightTheme} from "../../styles/theme";
import NozzleCursor from "./NozzleCursor";

function mockMedia({fine, reducedMotion}: { fine: boolean; reducedMotion: boolean }) {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
        matches: query === "(pointer: fine)" ? fine : query === "(prefers-reduced-motion: reduce)" ? reducedMotion : false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
    }));
}

const renderCursor = () => render(
    <StyledThemeProvider theme={lightTheme}>
        <NozzleCursor/>
    </StyledThemeProvider>
);

describe("NozzleCursor", () => {
    beforeEach(() => {
        // jsdom has no canvas; the cursor must cope with a missing 2d context
        jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("is rendered for a mouse without reduced motion", () => {
        mockMedia({fine: true, reducedMotion: false});
        renderCursor();
        expect(screen.getByTestId("nozzle-cursor")).toBeInTheDocument();
    });

    test("is not rendered on touch devices", () => {
        mockMedia({fine: false, reducedMotion: false});
        renderCursor();
        expect(screen.queryByTestId("nozzle-cursor")).not.toBeInTheDocument();
    });

    test("is not rendered when reduced motion is requested", () => {
        mockMedia({fine: true, reducedMotion: true});
        renderCursor();
        expect(screen.queryByTestId("nozzle-cursor")).not.toBeInTheDocument();
    });
});
