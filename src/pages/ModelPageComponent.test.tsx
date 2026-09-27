import React from "react";
import {render, screen, waitFor, act} from "@testing-library/react";
import {createMemoryRouter, RouterProvider} from "react-router-dom";
import {AppProvider} from "../state/AppContext";
import {ThemeProvider} from "../contexts/ThemeContext";
import {lightTheme} from "../styles/theme";
import {ThemeProvider as StyledThemeProvider} from "styled-components";
import {getModelCard} from "../services/ProductService";
import {PrintModel} from "../types/PrintModel";
import ModelPageComponent from "./ModelPageComponent";

jest.mock("../components/AsyncImage", () => ({
    __esModule: true,
    default: (props: {className?: string}) => (
        <div data-testid="slider-image" className={props?.className} />
    ),
}));

jest.mock("../services/ProductService", () => ({
    getModelCard: jest.fn(),
}));

const mockModel = {
    id: "123",
    addedAt: "2024-01-01T12:00:00Z",
    preview: "http://example.com/preview.png",
    modelName: "Test Model",
    rate: 5,
    nsfw: false,
    category: "Main",
    categories: ["Main"],
    path: "path/to/model",
    oths: [],
    zips: []
} as PrintModel;

const model = (name: string): PrintModel => ({...mockModel, modelName: name});

function renderModel(initialId: string) {
    const router = createMemoryRouter(
        [
            {path: "/models/:id", element: <AppProvider><ModelPageComponent /></AppProvider>}
        ],
        {initialEntries: ["/models/" + initialId]}
    );
    const returned = render(
        <ThemeProvider>
            <StyledThemeProvider theme={lightTheme}>
                <RouterProvider router={router} />
            </StyledThemeProvider>
        </ThemeProvider>
    );
    return {router, ...returned};
}

describe("ModelPageComponent", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("shows loading skeleton instead of error text while the model is fetching", async () => {
        (getModelCard as jest.Mock).mockReturnValue(new Promise(() => {}));

        renderModel("123");

        expect(screen.queryByText("Error")).not.toBeInTheDocument();
        expect(screen.getByTestId("slider-skeleton")).toBeInTheDocument();
        expect(screen.queryByText("Model")).not.toBeInTheDocument();
    });

    test("shows the model name, slider image and document title after the model loads", async () => {
        (getModelCard as jest.Mock).mockResolvedValue(mockModel);

        renderModel("123");

        await screen.findByText("Test Model");
        expect(screen.getByTestId("slider-image")).toBeInTheDocument();
        await waitFor(() => {
            expect(document.title).toBe("Test Model");
        });
    });

    test("shows error block with retry button and catalog link when the model fails to load", async () => {
        (getModelCard as jest.Mock).mockRejectedValueOnce(new Error("boom"));

        renderModel("123");

        await screen.findByText(/Failed to load model/);
        expect(screen.getByRole("button", {name: /try again/i})).toBeInTheDocument();
        expect(screen.getByRole("link", {name: /catalog/i})).toBeInTheDocument();
    });

    test("retry button refetches the model after a failure", async () => {
        (getModelCard as jest.Mock)
            .mockRejectedValueOnce(new Error("boom"))
            .mockResolvedValueOnce(mockModel);

        renderModel("123");

        await screen.findByText(/Failed to load model/);
        screen.getByRole("button", {name: /try again/i}).click();

        await screen.findByText("Test Model");
        expect(getModelCard).toHaveBeenCalledTimes(2);
    });

    test("ignores the stale response when the id changes before the first fetch settles", async () => {
        const resolves: Record<string, (m: PrintModel) => void> = {};
        (getModelCard as jest.Mock).mockImplementation((id: string) => {
            return new Promise((res) => {
                resolves[id] = res;
            });
        });

        const {router} = renderModel("1");
        expect(resolves["1"]).toBeDefined();

        await act(() => {
            router.navigate("/models/2");
        });
        expect(resolves["2"]).toBeDefined();

        await act(() => {
            resolves["1"](model("Stale"));
        });

        await waitFor(() => {
            expect(screen.queryByText("Stale")).not.toBeInTheDocument();
        });

        act(() => {
            resolves["2"](model("Fresh"));
        });

        await screen.findByText("Fresh");
    });
});
