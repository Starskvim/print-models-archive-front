import React from "react";
import {act, fireEvent, render, screen} from "@testing-library/react";
import {createMemoryRouter, RouterProvider} from "react-router-dom";
import {ThemeProvider as StyledThemeProvider} from "styled-components";
import {lightTheme} from "../styles/theme";
import {fetchSuggestionsPrintModels} from "../services/ProductService";
import {PrintModelSuggest} from "../types/PrintModelSuggest";
import SearchBox from "./SearchBox";

jest.mock("../services/ProductService", () => ({
    fetchSuggestionsPrintModels: jest.fn(),
}));

const mockFetch = fetchSuggestionsPrintModels as jest.Mock;

const suggest = (id: string, modelName: string): PrintModelSuggest => ({
    id,
    modelName,
    preview: "http://example.com/" + id + ".png",
    category: "Robots",
    mainCategory: "Robots",
    rate: 4,
    nsfw: false,
});

function deferred<T>() {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>(r => (resolve = r));
    return {promise, resolve};
}

function renderSearch(value = "") {
    const onSearch = jest.fn();
    // One catch-all route: like the real header, SearchBox stays mounted across navigation.
    const router = createMemoryRouter(
        [{path: "*", element: <SearchBox value={value} onSearch={onSearch}/>}],
        {initialEntries: ["/"]}
    );
    render(
        <StyledThemeProvider theme={lightTheme}>
            <RouterProvider router={router}/>
        </StyledThemeProvider>
    );
    return {onSearch, router, input: screen.getByRole("searchbox")};
}

const type = (input: HTMLElement, value: string) => fireEvent.change(input, {target: {value}});

async function flushDebounce() {
    await act(async () => {
        jest.advanceTimersByTime(400);
    });
}

describe("SearchBox", () => {
    beforeEach(() => {
        jest.useFakeTimers();
        mockFetch.mockReset();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test("debounces typing into a single suggestions request and shows the results", async () => {
        mockFetch.mockResolvedValue({suggestions: [suggest("M1", "Scout Drone"), suggest("M2", "Rover")]});
        const {input} = renderSearch();

        type(input, "r");
        type(input, "ro");
        await flushDebounce();

        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith("ro");
        expect(await screen.findByText("Scout Drone")).toBeInTheDocument();
        expect(screen.getByText("Rover")).toBeInTheDocument();
    });

    test("ignores a stale response that arrives after a newer query", async () => {
        const first = deferred<{ suggestions: PrintModelSuggest[] }>();
        const second = deferred<{ suggestions: PrintModelSuggest[] }>();
        mockFetch.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
        const {input} = renderSearch();

        type(input, "r");
        await flushDebounce();
        type(input, "ro");
        await flushDebounce();

        await act(async () => second.resolve({suggestions: [suggest("M2", "Rover")]}));
        await act(async () => first.resolve({suggestions: [suggest("M9", "Stale Result")]}));

        expect(screen.getByText("Rover")).toBeInTheDocument();
        expect(screen.queryByText("Stale Result")).not.toBeInTheDocument();
    });

    test("clearing the input hides suggestions and a pending response does not reopen them", async () => {
        const pending = deferred<{ suggestions: PrintModelSuggest[] }>();
        mockFetch.mockReturnValueOnce(pending.promise);
        const {input} = renderSearch();

        type(input, "ro");
        await flushDebounce();
        type(input, "");
        await act(async () => pending.resolve({suggestions: [suggest("M2", "Rover")]}));

        expect(screen.queryByText("Rover")).not.toBeInTheDocument();
    });

    test("Enter submits the query and closes suggestions", async () => {
        mockFetch.mockResolvedValue({suggestions: [suggest("M2", "Rover")]});
        const {input, onSearch} = renderSearch();

        type(input, "ro");
        await flushDebounce();
        expect(await screen.findByText("Rover")).toBeInTheDocument();

        fireEvent.keyDown(input, {key: "Enter"});

        expect(onSearch).toHaveBeenCalledWith("ro");
        expect(screen.queryByText("Rover")).not.toBeInTheDocument();
    });

    test("Escape closes suggestions without submitting", async () => {
        mockFetch.mockResolvedValue({suggestions: [suggest("M2", "Rover")]});
        const {input, onSearch} = renderSearch();

        type(input, "ro");
        await flushDebounce();
        expect(await screen.findByText("Rover")).toBeInTheDocument();

        fireEvent.keyDown(input, {key: "Escape"});

        expect(screen.queryByText("Rover")).not.toBeInTheDocument();
        expect(onSearch).not.toHaveBeenCalled();
    });

    test("clicking a suggestion opens the model page and closes suggestions", async () => {
        mockFetch.mockResolvedValue({suggestions: [suggest("M2", "Rover")]});
        const {input, router} = renderSearch();

        type(input, "ro");
        await flushDebounce();
        fireEvent.click(await screen.findByText("Rover"));

        expect(router.state.location.pathname).toBe("/models/M2");
        expect(screen.queryByText("Rover")).not.toBeInTheDocument();
    });

    test("clear button empties the input and resets the search", async () => {
        const {input, onSearch} = renderSearch("robot");
        expect(input).toHaveValue("robot");

        fireEvent.click(screen.getByRole("button", {name: /clear search/i}));

        expect(input).toHaveValue("");
        expect(onSearch).toHaveBeenCalledWith("");
    });
});
