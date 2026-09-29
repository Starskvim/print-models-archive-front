import React, {useEffect} from "react";
import {act, fireEvent, render, screen, waitFor} from "@testing-library/react";
import {createMemoryRouter, RouterProvider} from "react-router-dom";
import {ThemeProvider as StyledThemeProvider} from "styled-components";
import {lightTheme} from "../styles/theme";
import {AppProvider, useAppContext} from "../state/AppContext";
import {fetchModelCards} from "../services/ProductService";
import ModelsPageComponent from "./ModelsPageComponent";

jest.mock("../services/ProductService", () => ({
    fetchModelCards: jest.fn(),
}));

jest.mock("../components/card/PrintModelCardsComponent", () => ({
    __esModule: true,
    default: () => <div data-testid="cards"/>,
}));

const mockFetch = fetchModelCards as jest.Mock;

const CATEGORY_ARG = 4;
const lastCategory = () => mockFetch.mock.calls[mockFetch.mock.calls.length - 1][CATEGORY_ARG];

// Categories normally arrive via the header's catalog fetch.
const SeedCategories: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {updateGlobalState} = useAppContext();
    useEffect(() => {
        updateGlobalState({
            categories: [{name: "Robots", size: 4}, {name: "Animals", size: 5}] as any,
        });
    }, []);
    return <>{children}</>;
};

function renderCatalog(initialPath: string) {
    const page = <ModelsPageComponent/>;
    const router = createMemoryRouter(
        [
            {path: "/models", element: page},
            {path: "/models/category/:categoryName", element: page},
        ],
        {initialEntries: [initialPath]}
    );
    render(
        <StyledThemeProvider theme={lightTheme}>
            <AppProvider>
                <SeedCategories>
                    <RouterProvider router={router}/>
                </SeedCategories>
            </AppProvider>
        </StyledThemeProvider>
    );
    return {router};
}

const categoryButton = (name: string) => screen.getByRole("button", {name: new RegExp(`^${name}`)});

describe("ModelsPageComponent categories", () => {
    beforeEach(() => {
        mockFetch.mockReset();
        mockFetch.mockResolvedValue({models: [{id: "M1"}], totalElements: 1, totalPages: 1});
        window.scrollTo = jest.fn();
    });

    test("clicking the selected category again returns to the full catalog", async () => {
        renderCatalog("/models");
        await screen.findByTestId("cards");

        fireEvent.click(categoryButton("Robots"));
        await waitFor(() => expect(lastCategory()).toBe("Robots"));
        expect(categoryButton("Robots")).toHaveAttribute("aria-pressed", "true");

        fireEvent.click(categoryButton("Robots"));
        await waitFor(() => expect(lastCategory()).toBe("all"));
        expect(categoryButton("Robots")).toHaveAttribute("aria-pressed", "false");
    });

    test("a category from the URL is highlighted and can be switched off", async () => {
        const {router} = renderCatalog("/models/category/Animals");
        await screen.findByTestId("cards");
        expect(lastCategory()).toBe("Animals");
        expect(categoryButton("Animals")).toHaveAttribute("aria-pressed", "true");

        fireEvent.click(categoryButton("Animals"));

        await waitFor(() => expect(router.state.location.pathname).toBe("/models"));
        await waitFor(() => expect(lastCategory()).toBe("all"));
        expect(categoryButton("Animals")).toHaveAttribute("aria-pressed", "false");
    });

    test("picking another category while on a category URL switches to it", async () => {
        const {router} = renderCatalog("/models/category/Animals");
        await screen.findByTestId("cards");

        await act(async () => {
            fireEvent.click(categoryButton("Robots"));
        });

        await waitFor(() => expect(router.state.location.pathname).toBe("/models"));
        await waitFor(() => expect(lastCategory()).toBe("Robots"));
        expect(categoryButton("Robots")).toHaveAttribute("aria-pressed", "true");
        expect(categoryButton("Animals")).toHaveAttribute("aria-pressed", "false");
    });
});
