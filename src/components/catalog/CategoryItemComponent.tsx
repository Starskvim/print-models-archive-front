import React, { useState, FC } from 'react';
import {Category} from "./Test";

interface CategoryItemProps {
    category: Category;
}

const CategoryItem: FC<CategoryItemProps> = ({ category }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (
        <li>
            <button onClick={toggle} style={{ background: 'none', border: 'none', textAlign: 'left' }}>
                {category.name} {category.children && <span>{isOpen ? '▼' : '►'}</span>}
            </button>
            {isOpen && category.children && (
                <ul style={{ listStyle: 'none', paddingLeft: '20px' }}>
                    {category.children.map(child => (
                        <CategoryItem key={child.id} category={child} />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default CategoryItem;