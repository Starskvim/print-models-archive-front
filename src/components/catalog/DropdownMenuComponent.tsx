import React, { FC, useState } from 'react';
import CategoryItem from "./CategoryItemComponent";
import {Category} from "./Test";

interface DropdownMenuProps {
    categories: Category[];
}

const DropdownMenu: FC<DropdownMenuProps> = (
    { categories }
) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="dropdownMenu">
            <button onClick={toggleMenu}>Categories {isMenuOpen ? '▼' : '►'}</button>
            {isMenuOpen && (
                <ul style={{ listStyle: 'none', paddingLeft: '0', position: 'absolute', backgroundColor: 'white', border: '1px solid #ccc' }}>
                    {categories.map(category => (
                        <CategoryItem key={category.id} category={category} />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropdownMenu;