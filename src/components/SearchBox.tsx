import React, {useEffect, useState} from 'react';
import {debounce} from 'lodash';
import {fetchSuggestionsPrintModels} from "../services/ProductService";
import {NavLink} from "react-router-dom";
import styled from "styled-components";
import {PrintModelSuggest} from "../types/PrintModelSuggest";

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

    const [suggestions, setSuggestions] = useState<PrintModelSuggest[]>([]);

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
        if (name !== undefined) {
            const response = await fetchSuggestionsPrintModels(name);
            setSuggestions(response.suggestions ? response.suggestions : []);
        }
    }, 400);

    // TODO width: "800px" ?????
    return (
        <StyledSuggests>
            <div className="search-box-container-element" style={{ width: "800px" }}>
                <input
                    type="text"
                    className="search-box-container-input"
                    placeholder="Search by models name..."
                    value={inputValue || ''}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    style={{ width: "100%" }}
                />
                {suggestions.length > 0 && (
                    <ul className="suggestions">
                        {suggestions.map((suggestion, index) => (
                            <NavLink to={`/models/${suggestion.id}`} key={index}>
                                <li>
                                    <div className="suggestion-item">
                                        <img
                                            src={suggestion.preview}
                                            alt={suggestion.modelName}
                                            className="suggestion-image"
                                        />
                                        <span className="suggestion-name">{suggestion.modelName} </span>
                                    </div>
                                </li>
                            </NavLink>
                        ))}
                    </ul>
                )}
            </div>
        </StyledSuggests>
    );
};

const StyledSuggests = styled.div`

    .search-box-container-input {
        width: 100%; /* Занимает всю ширину своего контейнера */
        padding: 5px 8px; /* Добавляем немного внутреннего отступа для удобства */
        box-sizing: border-box; /* Гарантирует, что padding не добавит дополнительную ширину */
        border: 1px solid #ccc; /* Стилизация границы */
        border-radius: 4px; /* Скругление углов */
    }
    
    .suggestion-item {
        display: flex;
        align-items: center;
        padding: 8px;
        border-bottom: 1px solid #ddd;
    }

    .suggestion-image {
        width: 50px;
        height: 50px;
        object-fit: cover;
        margin-right: 10px;
        border-radius: 4px;
    }

    .suggestion-name {
        font-size: 16px;
    }

    .suggestion-item:hover {
        background-color: #f0f0f0;
    }


    .suggestions {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        z-index: 1000;
        list-style: none;
        padding: 0;
        margin: 0 auto;
        border: 1px solid #ccc;
        border-top: none;
        
        width: 55%; /* Уменьшение ширины контейнера */

        li {
            padding: 8px 12px;
            cursor: pointer;

            &:hover {
                background-color: #f0f0f0;
            }
        }
    }

    .suggestions li {
        padding: 8px 10px;
        cursor: pointer;
    }

    .suggestions li:hover,
    .suggestions li:focus {
        background-color: #f0f0f0; /* Стиль для наведения и фокуса */
    }
`;

export default SearchBox;