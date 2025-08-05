import React, {useEffect, useState} from 'react';
import {debounce} from 'lodash';
import {fetchSuggestionsPrintModels} from "../services/ProductService";
import {NavLink} from "react-router-dom";
import styled from "styled-components";
import {PrintModelSuggest} from "../types/PrintModelSuggest";
import StarRatingComponent from './card/StarRatingComponent';
import NSFWIndicatorComponent from './card/NSFWIndicatorComponent';

interface SearchBoxProps {
    value: string | undefined;
    onKeyDown: (value: string) => void
}

const SearchBox: React.FC<SearchBoxProps> = (
    {
        value,
        onKeyDown
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
                            <NavLink to={`/models/${suggestion.id}`} key={index}>
                                <li>
                                    <div className="suggestion-item">
                                        <img
                                            src={suggestion.preview}
                                            alt={suggestion.modelName}
                                            className="suggestion-image"
                                        />
                                        <div className="suggestion-content">
                                            <span className="suggestion-name">{suggestion.modelName}</span>
                                            <div className="suggestion-metadata">
                                                <StarRatingComponent selectedStars={suggestion.rate} totalStars={5} />
                                                <NSFWIndicatorComponent isVisible={suggestion.nsfw} />
                                            </div>
                                        </div>
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
    width: 100%;
    position: relative;

    .search-box-container-element {
        flex-grow: 1;
        width: 100%;
        margin: 0;
        padding: 0;
        border: none;
        background: transparent;
        position: relative;
    }

    .search-box-container-input {
        width: 100%;
        padding: 12px 16px;
        box-sizing: border-box;
        border: 1px solid ${({theme}) => theme.colors.border};
        border-radius: 4px;
        font-size: 16px;
        background-color: ${({theme}) => theme.colors.input_bg};
        color: ${({theme}) => theme.colors.text};
        
        &:focus {
            border-color: ${({theme}) => theme.colors.helper};
            box-shadow: 0 0 0 2px ${({theme}) => theme.colors.border};
            outline: none;
        }
        
        &::placeholder {
            color: ${({theme}) => theme.colors.text};
            opacity: 0.6;
        }
    }
    
    .suggestion-item {
        display: flex;
        align-items: center;
        padding: 8px;
        border-bottom: 1px solid ${({theme}) => theme.colors.border};
        background-color: ${({theme}) => theme.colors.input_bg};
        
        &:hover {
            background-color: ${({theme}) => theme.colors.bg};
        }
    }

    .suggestion-image {
        width: 50px;
        height: 50px;
        object-fit: cover;
        margin-right: 10px;
        border-radius: 4px;
    }

    .suggestion-content {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 4px;
    }

    .suggestion-name {
        font-size: 16px;
        color: ${({theme}) => theme.colors.text};
    }

    .suggestion-metadata {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .suggestion-metadata .star {
        font-size: 16px;
    }

    .suggestions {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: ${({theme}) => theme.colors.input_bg};
        z-index: 1000;
        list-style: none;
        padding: 0;
        margin: 0 auto;
        border: 1px solid ${({theme}) => theme.colors.border};
        border-top: none;
        border-radius: 0 0 4px 4px;
        box-shadow: ${({theme}) => theme.colors.shadowSupport};
        
        width: 55%;

        li {
            padding: 8px 12px;
            cursor: pointer;
            color: ${({theme}) => theme.colors.text};

            &:hover {
                background-color: ${({theme}) => theme.colors.bg};
            }
            
            &:last-child {
                border-radius: 0 0 4px 4px;
            }
        }
    }
`;

export default SearchBox;