import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Avatar } from '@mui/material';
import CustomButton from "../button/CustomButton";
import CustomTextField from "../input/CustomTextField";
// Główna funkcja komponentu
const CustomListWithSearch = ({
    data,
    label,
    onItemSelect,
    renderItem,
    filterKey="name"
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredItems, setFilteredItems] = useState(data);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isFocused, setIsFocused] = useState(false);

    //filter function
    useEffect(() => {
        setFilteredItems(
            data.filter(item =>
            item[filterKey].toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, data, filterKey]);

    const handleItemClick = (item) => {
        console.log("wybrano item")
        setSelectedItem(item);
        setSearchTerm(item[filterKey]);
        onItemSelect(item);
        setIsFocused(false);

    }

    const handleBlur = () => {
        if (!selectedItem || searchTerm !== selectedItem[filterKey]) {
            setSearchTerm("");
            onItemSelect(null);
        }
        setIsFocused(false);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    return (
        <div>
            <CustomTextField
                label = {label}
                value = {searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onBlur={handleBlur}
                onFocus={handleFocus}
            />
            {isFocused && filteredItems.length > 0 && (
            <List>
                {filteredItems.map((item) => (
                    <ListItem key={item.id} button={true} onMouseDown={() => handleItemClick(item)} >
                        {renderItem(item)}
                    </ListItem>
                ))}
            </List>
                )}
        </div>
    )
}

export default CustomListWithSearch;
