import React from 'react';
import {Box} from '@mui/material';
import CustomButton from "./button/CustomButton";
import Button from "@mui/material/Button";


const Sidebar = ({selectedTab, setSelectedTab, friendsCount, pendingCount}) => {
    const tabs = [
        {label: `Znajomi (${friendsCount})`, value: 'friends'},
        {label: `Oczekujące (${pendingCount})`, value: 'pending'},
        {label: 'Dodaj znajomego', value: 'add'},
    ];

    return (
        <Box
            sx={{
                borderRight: '1px solid #ccc',
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                overflowX: 'auto',
                alignItems: 'center',
            }}
        >
            {tabs.map((tab) => (
                <Button
                    size="small"
                    key={tab.value}
                    onClick={() => setSelectedTab(tab.value)}
                    sx={{
                        width: {xs: '50%', md: '100%'},
                        backgroundColor: selectedTab === tab.value ? 'red' : 'darkgrey',
                    }}
                >
                    {tab.label}
                </Button>
            ))}
        </Box>
    );
};

export default Sidebar;
