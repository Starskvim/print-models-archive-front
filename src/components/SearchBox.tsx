import React, {useEffect, useState} from 'react';
import {debounce} from 'lodash';
import {PrintModelCard} from "../types/PrintModelCard";
import {fetchSuggestionsModelCards} from "../services/ProductService";
import {NavLink} from "react-router-dom";
import styled from "styled-components";

interface SearchBoxProps {
    value: string | undefined;
    onKeyDown: (value: string) => void;
    className?: string
}

const SearchBox: React.FC<SearchBoxProps> = (
    {
        value,
        onKeyDown,
        className
    }
) => {

    const [inputValue, setInputValue] = useState(value);

    const [suggestions, setSuggestions] = useState<PrintModelCard[]>([]);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.currentTarget.value);
        setSuggestions([])
        if (e.currentTarget.value !== "") {
            fetchSuggestions(e.currentTarget.value)
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onKeyDown(inputValue || '');
        }
    };

    const fetchSuggestions = debounce(async name => {
        const response = await fetchSuggestionsModelCards(name);
        setSuggestions(response.models ? response.models : []);
    }, 400);

    return (
            <div className="search-box-container-element">
                <input
                    type="text"
                    className="search-box-container-input"
                    placeholder="Search by models name..."
                    value={inputValue || ''}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
                {suggestions.length > 0 && (
                    <ul className="suggestions">
                        {suggestions.map((suggestion, index) => (
                            <NavLink to={`/models/${suggestion.id}`}>
                                <li key={index}>
                                    {suggestion.modelName}
                                </li>
                            </NavLink>
                        ))}
                    </ul>
                )}
            </div>
    );
};

export default SearchBox;