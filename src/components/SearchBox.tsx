import React, {useEffect, useMemo, useRef, useState} from 'react';
import {debounce} from 'lodash';
import {fetchSuggestionsPrintModels} from "../services/ProductService";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {PrintModelSuggest} from "../types/PrintModelSuggest";
import StarRatingComponent from './card/StarRatingComponent';
import NSFWIndicatorComponent from './card/NSFWIndicatorComponent';

interface SearchBoxProps {
    value: string | undefined;
    onSearch: (value: string) => void
}

const SearchBox: React.FC<SearchBoxProps> = (
    {
        value,
        onSearch
    }
) => {

    const [inputValue, setInputValue] = useState(value || '');
    const [suggestions, setSuggestions] = useState<PrintModelSuggest[]>([]);
    const rootRef = useRef<HTMLDivElement>(null);
    // Only the response for the latest query may update suggestions.
    const latestQuery = useRef('');

    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    const fetchSuggestions = useMemo(() => debounce(async (query: string) => {
        try {
            const response = await fetchSuggestionsPrintModels(query);
            if (latestQuery.current !== query) return;
            setSuggestions(response.suggestions ? response.suggestions : []);
        } catch (error) {
            if (latestQuery.current === query) setSuggestions([]);
        }
    }, 400), []);

    useEffect(() => () => fetchSuggestions.cancel(), [fetchSuggestions]);

    const closeSuggestions = () => {
        latestQuery.current = '';
        fetchSuggestions.cancel();
        setSuggestions([]);
    };

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
                setSuggestions([]);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.currentTarget.value;
        setInputValue(query);
        setSuggestions([]);
        latestQuery.current = query;
        if (query !== '') {
            fetchSuggestions(query);
        } else {
            fetchSuggestions.cancel();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            closeSuggestions();
            onSearch(inputValue);
        } else if (e.key === 'Escape') {
            closeSuggestions();
        }
    };

    const handleClear = () => {
        closeSuggestions();
        setInputValue('');
        onSearch('');
    };

    return (
        <StyledSuggests>
            <div className="search-root" ref={rootRef}>
                <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="11" cy="11" r="7"/>
                    <line x1="16.5" y1="16.5" x2="21" y2="21"/>
                </svg>
                <input
                    type="search"
                    className="search-input"
                    placeholder="Search by models name..."
                    aria-label="Search models"
                    autoComplete="off"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
                {inputValue !== '' && (
                    <button type="button" className="clear-btn" aria-label="Clear search" onClick={handleClear}>
                        ×
                    </button>
                )}
                {suggestions.length > 0 && (
                    <ul className="suggestions">
                        {suggestions.map(suggestion => (
                            <li key={suggestion.id}>
                                <Link to={`/models/${suggestion.id}`} className="suggestion-item" onClick={closeSuggestions}>
                                    <img
                                        src={suggestion.preview}
                                        alt={suggestion.modelName}
                                        className="suggestion-image"
                                    />
                                    <div className="suggestion-content">
                                        <span className="suggestion-name">{suggestion.modelName}</span>
                                        <div className="suggestion-metadata">
                                            <StarRatingComponent selectedStars={suggestion.rate} totalStars={5}/>
                                            <NSFWIndicatorComponent isVisible={suggestion.nsfw}/>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </StyledSuggests>
    );
};

const StyledSuggests = styled.div<{ children?: React.ReactNode }>`
    width: 100%;

    .search-root {
        position: relative;
        width: 100%;
    }

    .search-icon {
        position: absolute;
        left: 14px;
        top: 50%;
        width: 18px;
        height: 18px;
        transform: translateY(-50%);
        fill: none;
        stroke: ${({theme}) => theme.colors.text};
        stroke-width: 2;
        stroke-linecap: round;
        opacity: 0.5;
        pointer-events: none;
    }

    .search-input {
        width: 100%;
        height: 44px;
        padding: 0 40px 0 42px;
        border: 1px solid ${({theme}) => theme.colors.border};
        border-radius: 8px;
        font-size: 16px;
        background-color: ${({theme}) => theme.colors.input_bg};
        color: ${({theme}) => theme.colors.text};
        transition: border-color 0.2s ease, box-shadow 0.2s ease;

        &:focus {
            border-color: ${({theme}) => theme.colors.btn};
            box-shadow: 0 0 0 3px ${({theme}) => theme.colors.border};
            outline: none;
        }

        &::placeholder {
            color: ${({theme}) => theme.colors.text};
            opacity: 0.5;
        }

        &::-webkit-search-cancel-button {
            display: none;
        }
    }

    .clear-btn {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        width: 28px;
        height: 28px;
        border: none;
        border-radius: 50%;
        background: transparent;
        color: ${({theme}) => theme.colors.text};
        font-size: 22px;
        line-height: 1;
        opacity: 0.6;
        cursor: pointer;

        &:hover {
            opacity: 1;
            background-color: ${({theme}) => theme.colors.bg};
        }
    }

    .suggestions {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        right: 0;
        z-index: 1000;
        list-style: none;
        margin: 0;
        padding: 6px;
        background: ${({theme}) => theme.colors.input_bg};
        border: 1px solid ${({theme}) => theme.colors.border};
        border-radius: 8px;
        box-shadow: ${({theme}) => theme.colors.shadowSupport};
        max-height: 60vh;
        overflow-y: auto;
    }

    .suggestion-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px;
        border-radius: 6px;
        text-decoration: none;
        color: ${({theme}) => theme.colors.text};

        &:hover,
        &:focus-visible {
            background-color: ${({theme}) => theme.colors.bg};
            outline: none;
        }
    }

    .suggestion-image {
        width: 48px;
        height: 48px;
        flex-shrink: 0;
        object-fit: cover;
        border-radius: 6px;
    }

    .suggestion-content {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
        gap: 4px;
    }

    .suggestion-name {
        font-size: 16px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .suggestion-metadata {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .suggestion-metadata .star {
        font-size: 16px;
    }
`;

export default SearchBox;
