import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';

interface SearchBoxProps {
    value: string | undefined;
    onChange: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange }) => {

    const [inputValue, setInputValue] = useState(value);

    const debouncedOnChange = debounce(onChange, 400);

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
            className="form-control my-3"
            placeholder="Search by products name..."
            value={inputValue || ''}
            onChange={handleChange}
        />
    );
};

export default SearchBox;