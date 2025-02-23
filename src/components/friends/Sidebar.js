import React from 'react';
import {Box} from '@mui/material';
import Button from "@mui/material/Button";
import {useTranslation} from 'react-i18next';


const Sidebar = ({selectedTab, setSelectedTab, friendsCount, pendingCount}) => {
    const {t } = useTranslation('friendsPage');

    const tabs = [
        {label: `${t('buttons.friends')} (${friendsCount})`, value: 'friends'},
        {label: `${t('buttons.requests')} (${pendingCount})`, value: 'pending'},
        {label: t('buttons.addFriend'), value: 'add'},
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
                        backgroundColor: selectedTab === tab.value ? 'red' : '#434343',
                    }}
                >
                    {tab.label}
                </Button>
            ))}
        </Box>
    );
};

export default Sidebar;
