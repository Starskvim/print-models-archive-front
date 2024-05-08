import React, {useEffect, useState} from 'react';
import {debounce} from 'lodash';
import styled from "styled-components";

interface SearchBoxProps {
    value: string | undefined;
    onChange: (value: string) => void;
    className?: string;
}

// TODO form and suggest
const SearchBox: React.FC<SearchBoxProps> = (
    {value, onChange, className}
) => {

    const [inputValue, setInputValue] = useState(value);

    const debouncedOnChange = debounce(onChange, 300);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.currentTarget.value);
        debouncedOnChange(e.currentTarget.value);
    };

    return (
            <input
                type="text"
                className={className}
                placeholder="Search by models name..."
                value={inputValue || ''}
                onChange={handleChange}
            />
    );
};

export default SearchBox;