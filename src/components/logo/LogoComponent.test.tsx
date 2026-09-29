import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {ThemeProvider as StyledThemeProvider} from "styled-components";
import {lightTheme} from "../../styles/theme";
import LogoComponent from "./LogoComponent";

function renderLogo() {
    return render(
        <StyledThemeProvider theme={lightTheme}>
            <MemoryRouter>
                <LogoComponent/>
            </MemoryRouter>
        </StyledThemeProvider>
    );
}

describe("LogoComponent", () => {
    test("is a link to the home page with an accessible name", () => {
        renderLogo();
        expect(screen.getByRole("link", {name: "PrintModelArchive — home"})).toHaveAttribute("href", "/");
    });

    test("hover restarts the print only after the current print has finished", () => {
        const {container} = renderLogo();
        const link = screen.getByRole("link");
        const firstPrint = container.querySelector(".print-area");

        fireEvent.mouseEnter(link);
        expect(container.querySelector(".print-area")).toBe(firstPrint);

        // jsdom has no AnimationEvent, so set animationName on a plain event
        const parked = Object.assign(new Event("animationend", {bubbles: true}), {animationName: "logo-nozzle-park"});
        fireEvent(container.querySelector(".nozzle-track")!, parked);
        fireEvent.mouseEnter(link);
        expect(container.querySelector(".print-area")).not.toBe(firstPrint);
    });
});
